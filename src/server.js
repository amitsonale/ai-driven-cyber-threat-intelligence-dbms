'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const PSQL_BIN = process.env.PSQL_BIN || 'psql';
const VALID_SEVERITIES = new Set(['Low', 'Medium', 'High', 'Critical']);
const VALID_STATUSES = new Set(['Open', 'Investigating', 'Resolved', 'False Positive']);

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith('#') || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
loadEnvFile();

function sendJson(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  res.end(JSON.stringify(body));
}

function sqlLiteral(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function queryRows(sql) {
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL is not configured');
    error.code = 'NO_DATABASE_URL';
    throw error;
  }
  const wrapped = `SELECT COALESCE(json_agg(row_to_json(result_row)), '[]'::json)::text FROM (${sql}) AS result_row;`;
  const { stdout } = await execFileAsync(PSQL_BIN, [
    '--dbname', process.env.DATABASE_URL,
    '--no-psqlrc',
    '--set', 'ON_ERROR_STOP=1',
    '--tuples-only',
    '--no-align',
    '--command', wrapped,
  ], { timeout: 10000, maxBuffer: 1024 * 1024 });
  const line = stdout.trim();
  return line ? JSON.parse(line) : [];
}

async function queryOne(sql) {
  const rows = await queryRows(sql);
  return rows[0] || null;
}

async function getOverview() {
  const [totals, severity, recentAlerts, campaigns] = await Promise.all([
    queryOne(`SELECT
      (SELECT COUNT(*) FROM alert WHERE status IN ('Open','Investigating')) AS open_alerts,
      (SELECT COUNT(*) FROM alert WHERE severity = 'Critical' AND status IN ('Open','Investigating')) AS critical_alerts,
      (SELECT COUNT(*) FROM campaign WHERE status IN ('Active','Monitoring')) AS active_campaigns,
      (SELECT COUNT(*) FROM indicator) AS indicators,
      (SELECT COUNT(*) FROM asset) AS assets`),
    queryRows(`SELECT severity, COUNT(*) AS count FROM alert GROUP BY severity
      ORDER BY CASE severity WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END`),
    queryRows(`SELECT a.alert_id, a.severity, a.status, a.detected_at, a.details,
        ast.hostname, i.ioc_type, i.value AS indicator, u.full_name AS analyst
      FROM alert a
      JOIN asset ast ON ast.asset_id = a.asset_id
      JOIN indicator i ON i.indicator_id = a.indicator_id
      LEFT JOIN app_user u ON u.user_id = a.assigned_user_id
      ORDER BY a.detected_at DESC LIMIT 6`),
    queryRows(`SELECT campaign_id, campaign_name, threat_actor, status,
        correlation_score, indicator_count, alert_count
      FROM campaign_threat_summary ORDER BY correlation_score DESC LIMIT 5`),
  ]);
  return { totals, severity, recentAlerts, campaigns };
}

async function getAlerts(url) {
  const filters = [];
  const severity = url.searchParams.get('severity');
  const status = url.searchParams.get('status');
  if (severity && VALID_SEVERITIES.has(severity)) filters.push(`a.severity = ${sqlLiteral(severity)}`);
  if (status && VALID_STATUSES.has(status)) filters.push(`a.status = ${sqlLiteral(status)}`);
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  return queryRows(`SELECT a.alert_id, a.severity, a.status, a.detected_at, a.updated_at, a.details,
      ast.hostname, ast.ip_address::text AS ip_address, i.ioc_type, i.value AS indicator,
      i.confidence_score, u.full_name AS analyst
    FROM alert a
    JOIN asset ast ON ast.asset_id = a.asset_id
    JOIN indicator i ON i.indicator_id = a.indicator_id
    LEFT JOIN app_user u ON u.user_id = a.assigned_user_id
    ${where} ORDER BY a.detected_at DESC`);
}

async function updateAlertStatus(alertId, status) {
  const id = Number(alertId);
  if (!Number.isSafeInteger(id) || id < 1) return { error: 'Invalid alert ID.' };
  if (!VALID_STATUSES.has(status)) return { error: 'Choose a valid alert status.' };
  const rows = await queryRows(`UPDATE alert
      SET status = ${sqlLiteral(status)}
      WHERE alert_id = ${id}
      RETURNING alert_id, status, updated_at`);
  return rows[0] || null;
}

async function readBody(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 4096) throw new Error('Request body too large');
  }
  return body ? JSON.parse(body) : {};
}

async function handleApi(req, res, url) {
  if (req.method === 'GET' && url.pathname === '/api/health') {
    try {
      await queryOne('SELECT 1 AS ok');
      return sendJson(res, 200, { connected: true });
    } catch (error) {
      return sendJson(res, 503, {
        connected: false,
        message: error.code === 'NO_DATABASE_URL'
          ? 'Set DATABASE_URL in the project .env file.'
          : 'PostgreSQL is unavailable. Check the connection and run the SQL setup scripts.',
      });
    }
  }
  try {
    if (req.method === 'GET' && url.pathname === '/api/overview') {
      return sendJson(res, 200, await getOverview());
    }
    if (req.method === 'GET' && url.pathname === '/api/alerts') {
      return sendJson(res, 200, await getAlerts(url));
    }
    if (req.method === 'GET' && url.pathname === '/api/campaigns') {
      return sendJson(res, 200, await queryRows(`SELECT campaign_id, campaign_name, threat_actor,
        status, correlation_score, indicator_count, technique_count, alert_count
        FROM campaign_threat_summary ORDER BY correlation_score DESC, campaign_name`));
    }
    if (req.method === 'GET' && url.pathname === '/api/indicators') {
      return sendJson(res, 200, await queryRows(`SELECT i.indicator_id, i.ioc_type, i.value,
        i.confidence_score, i.first_seen, i.last_seen, s.name AS source,
        COUNT(DISTINCT ci.campaign_id) AS campaign_count
        FROM indicator i LEFT JOIN intel_source s ON s.source_id = i.source_id
        LEFT JOIN campaign_indicator ci ON ci.indicator_id = i.indicator_id
        GROUP BY i.indicator_id, s.name ORDER BY i.confidence_score DESC, i.indicator_id`));
    }
    if (req.method === 'GET' && url.pathname === '/api/assets') {
      return sendJson(res, 200, await queryRows(`SELECT ast.asset_id, ast.hostname,
        ast.ip_address::text AS ip_address, ast.asset_type, ast.criticality,
        org.name AS organization, COUNT(a.alert_id) AS alert_count
        FROM asset ast JOIN organization org ON org.org_id = ast.org_id
        LEFT JOIN alert a ON a.asset_id = ast.asset_id
        GROUP BY ast.asset_id, org.name ORDER BY
          CASE ast.criticality WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END,
          ast.hostname`));
    }
    const statusMatch = url.pathname.match(/^\/api\/alerts\/(\d+)\/status$/);
    if (req.method === 'PATCH' && statusMatch) {
      const body = await readBody(req);
      const result = await updateAlertStatus(statusMatch[1], body.status);
      if (result && result.error) return sendJson(res, 400, result);
      if (!result) return sendJson(res, 404, { error: 'Alert not found.' });
      return sendJson(res, 200, result);
    }
    return sendJson(res, 404, { error: 'API route not found.' });
  } catch (error) {
    console.error('API request failed:', error.message);
    return sendJson(res, 503, { error: 'Database request failed. Check PostgreSQL and the project schema.' });
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function serveStatic(req, res, url) {
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = path.resolve(PUBLIC_DIR, `.${requested}`);
  if (!filePath.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
    res.writeHead(200, {
      'content-type': MIME[path.extname(filePath)] || 'application/octet-stream',
      'x-content-type-options': 'nosniff',
      'cache-control': 'no-cache',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, `http://${req.headers.host || 'localhost'}`); }
  catch { return sendJson(res, 400, { error: 'Invalid request URL.' }); }
  if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
  return serveStatic(req, res, url);
});

server.listen(PORT, HOST, () => {
  console.log(`Threat Intelligence Console running at http://${HOST}:${PORT}`);
  if (!process.env.DATABASE_URL) console.log('DATABASE_URL is not set; add it to .env before loading dashboard data.');
});
