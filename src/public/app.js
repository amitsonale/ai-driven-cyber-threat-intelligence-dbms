'use strict';

const state = { view: 'overview', overview: null, alerts: [], campaigns: [], indicators: [], assets: [], evidence: [], health: null, toastTimer: null, demoMode: false };
const root = document.getElementById('view-root');
const banner = document.getElementById('connection-banner');

const DEMO = {
  overview: {
    totals: { open_alerts: 5, critical_alerts: 2, active_campaigns: 4, indicators: 8, assets: 7 },
    severity: [{severity:'Critical',count:2},{severity:'High',count:3},{severity:'Medium',count:2},{severity:'Low',count:1}],
    recentAlerts: [
      {alert_id:16,severity:'High',status:'Open',detected_at:'2025-01-16T17:00:00Z',hostname:'fin-app-01',ioc_type:'Hash',indicator:'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',analyst:'M. Sangamesh Prasad'},
      {alert_id:15,severity:'Medium',status:'Open',detected_at:'2025-01-15T16:00:00Z',hostname:'pes-library-02',ioc_type:'Domain',indicator:'sync-service.example',analyst:'Amit'},
      {alert_id:14,severity:'Critical',status:'Investigating',detected_at:'2025-01-14T15:00:00Z',hostname:'pes-lms-01',ioc_type:'Email',indicator:'security-notice@example.net',analyst:'M. Sangamesh Prasad'},
      {alert_id:13,severity:'Low',status:'False Positive',detected_at:'2025-01-13T14:00:00Z',hostname:'health-lab-03',ioc_type:'IP',indicator:'203.0.113.77',analyst:'Amit'},
      {alert_id:12,severity:'High',status:'Open',detected_at:'2025-01-12T13:00:00Z',hostname:'health-portal-01',ioc_type:'URL',indicator:'https://cdn.example/download.bin',analyst:'M. Sangamesh Prasad'},
      {alert_id:11,severity:'Medium',status:'Resolved',detected_at:'2025-01-11T12:00:00Z',hostname:'fin-ws-14',ioc_type:'Domain',indicator:'login-update.example',analyst:'Amit'},
    ],
    campaigns: [
      {campaign_id:1,campaign_name:'Blue Lantern',threat_actor:'APT29',status:'Active',correlation_score:0.950,indicator_count:3,alert_count:3},
      {campaign_id:2,campaign_name:'Winter Harbor',threat_actor:'APT29',status:'Monitoring',correlation_score:0.910,indicator_count:2,alert_count:2},
      {campaign_id:3,campaign_name:'Silent Orbit',threat_actor:'Lazarus Group',status:'Active',correlation_score:0.880,indicator_count:3,alert_count:2},
      {campaign_id:4,campaign_name:'Copper Trail',threat_actor:'FIN7',status:'Monitoring',correlation_score:0.840,indicator_count:1,alert_count:1},
      {campaign_id:5,campaign_name:'Amber Mist',threat_actor:'TA505',status:'Active',correlation_score:0.790,indicator_count:2,alert_count:2},
    ],
  },
  alerts: [
    {alert_id:9,severity:'High',status:'Open',detected_at:'2025-01-09T10:00:00Z',hostname:'fin-app-01',ip_address:'10.10.1.10',ioc_type:'IP',indicator:'198.51.100.24',confidence_score:92,analyst:'Amit'},
    {alert_id:10,severity:'Critical',status:'Investigating',detected_at:'2025-01-10T11:00:00Z',hostname:'fin-db-01',ip_address:'10.10.1.20',ioc_type:'Hash',indicator:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',confidence_score:88,analyst:'M. Sangamesh Prasad'},
    {alert_id:11,severity:'Medium',status:'Resolved',detected_at:'2025-01-11T12:00:00Z',hostname:'fin-ws-14',ip_address:'10.10.2.14',ioc_type:'Domain',indicator:'login-update.example',confidence_score:76,analyst:'Amit'},
    {alert_id:12,severity:'High',status:'Open',detected_at:'2025-01-12T13:00:00Z',hostname:'health-portal-01',ip_address:'10.20.1.10',ioc_type:'URL',indicator:'https://cdn.example/download.bin',confidence_score:65,analyst:'M. Sangamesh Prasad'},
    {alert_id:13,severity:'Low',status:'False Positive',detected_at:'2025-01-13T14:00:00Z',hostname:'health-lab-03',ip_address:'10.20.2.33',ioc_type:'IP',indicator:'203.0.113.77',confidence_score:54,analyst:'Amit'},
    {alert_id:14,severity:'Critical',status:'Investigating',detected_at:'2025-01-14T15:00:00Z',hostname:'pes-lms-01',ip_address:'10.30.1.10',ioc_type:'Email',indicator:'security-notice@example.net',confidence_score:81,analyst:'M. Sangamesh Prasad'},
    {alert_id:15,severity:'Medium',status:'Open',detected_at:'2025-01-15T16:00:00Z',hostname:'pes-library-02',ip_address:'10.30.2.12',ioc_type:'Domain',indicator:'sync-service.example',confidence_score:43,analyst:'Amit'},
    {alert_id:16,severity:'High',status:'Open',detected_at:'2025-01-16T17:00:00Z',hostname:'fin-app-01',ip_address:'10.10.1.10',ioc_type:'Hash',indicator:'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',confidence_score:96,analyst:'M. Sangamesh Prasad'},
  ],
  campaigns: null,
  indicators: [
    {indicator_id:1,ioc_type:'IP',value:'198.51.100.24',confidence_score:92,source:'Open Threat Feed',campaign_count:2,last_seen:'2025-01-09T11:00:00Z'},
    {indicator_id:2,ioc_type:'Domain',value:'login-update.example',confidence_score:76,source:'Internal SOC',campaign_count:2,last_seen:'2025-01-08T16:30:00Z'},
    {indicator_id:3,ioc_type:'Hash',value:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',confidence_score:88,source:'Regional ISAC',campaign_count:1,last_seen:'2025-01-06T12:00:00Z'},
    {indicator_id:4,ioc_type:'URL',value:'https://cdn.example/download.bin',confidence_score:65,source:'Vendor Intelligence',campaign_count:1,last_seen:'2025-01-07T12:00:00Z'},
    {indicator_id:5,ioc_type:'IP',value:'203.0.113.77',confidence_score:54,source:'Open Threat Feed',campaign_count:1,last_seen:'2025-01-10T08:00:00Z'},
    {indicator_id:6,ioc_type:'Email',value:'security-notice@example.net',confidence_score:81,source:'Internal SOC',campaign_count:1,last_seen:'2025-01-08T18:00:00Z'},
    {indicator_id:7,ioc_type:'Domain',value:'sync-service.example',confidence_score:43,source:'Regional ISAC',campaign_count:1,last_seen:'2025-01-11T10:00:00Z'},
    {indicator_id:8,ioc_type:'Hash',value:'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',confidence_score:96,source:'Vendor Intelligence',campaign_count:1,last_seen:'2025-01-12T20:00:00Z'},
  ],
  assets: [
    {asset_id:1,hostname:'fin-app-01',ip_address:'10.10.1.10',asset_type:'Application Server',criticality:'Critical',organization:'Northstar Finance',alert_count:2},
    {asset_id:2,hostname:'fin-db-01',ip_address:'10.10.1.20',asset_type:'Database Server',criticality:'Critical',organization:'Northstar Finance',alert_count:1},
    {asset_id:3,hostname:'fin-ws-14',ip_address:'10.10.2.14',asset_type:'Workstation',criticality:'High',organization:'Northstar Finance',alert_count:1},
    {asset_id:4,hostname:'health-portal-01',ip_address:'10.20.1.10',asset_type:'Web Server',criticality:'High',organization:'Meridian Health',alert_count:1},
    {asset_id:5,hostname:'health-lab-03',ip_address:'10.20.2.33',asset_type:'Workstation',criticality:'Medium',organization:'Meridian Health',alert_count:1},
    {asset_id:6,hostname:'pes-lms-01',ip_address:'10.30.1.10',asset_type:'Application Server',criticality:'High',organization:'PES University',alert_count:1},
    {asset_id:7,hostname:'pes-library-02',ip_address:'10.30.2.12',asset_type:'Server',criticality:'Medium',organization:'PES University',alert_count:1},
  ],
};
DEMO.campaigns = DEMO.overview.campaigns;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function n(value) { return Number(value || 0).toLocaleString(); }
function pct(value) { return Math.max(0, Math.min(100, Number(value || 0))); }
function badge(value) {
  const cls = String(value || '').toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  return `<span class="badge ${esc(cls)}">${esc(value || 'Unknown')}</span>`;
}
function date(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? esc(value) : parsed.toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
}
async function api(url, options) {
  const response = await fetch(url, { headers: {'content-type':'application/json'}, ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || payload.message || `Request failed (${response.status})`);
  return payload;
}
function showToast(text, isError=false) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.className = `toast show${isError ? ' error' : ''}`;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => { toast.className = 'toast'; }, 2600);
}
function setConnection(health) {
  state.health = health;
  const connected = Boolean(health && (health.postgresql ?? health.connected));
  const mongoConnected = Boolean(health && health.mongodb);
  const dot = document.getElementById('sidebar-dot');
  dot.className = `connection-dot ${connected && mongoConnected ? 'online' : connected ? 'partial' : 'offline'}`;
  document.getElementById('sidebar-connection').textContent = connected && mongoConnected ? '2 databases online' : connected ? 'PostgreSQL online' : 'Databases offline';
  document.getElementById('sidebar-databases').textContent = `SQL ${connected ? 'online' : 'offline'} · NoSQL ${mongoConnected ? 'online' : 'offline'}`;
  const topStatus = document.getElementById('topbar-db-status');
  topStatus.className = `live-label ${connected && mongoConnected ? 'online' : connected ? 'partial' : 'offline'}`;
  topStatus.innerHTML = `<i></i>${connected && mongoConnected ? '2 DATABASES ONLINE' : connected ? 'POSTGRESQL ONLINE · MONGODB OFFLINE' : 'DATABASES OFFLINE'}`;
  if (connected && mongoConnected) {
    state.demoMode = false;
    banner.classList.add('hidden');
  } else if (connected) {
    state.demoMode = false;
    banner.innerHTML = `<strong>PostgreSQL is connected; MongoDB evidence storage is offline.</strong> ${esc(health?.message || 'Start MongoDB and check MONGODB_URI.')}`;
    banner.classList.remove('hidden');
  } else {
    banner.innerHTML = `<strong>Sample preview — database offline.</strong> ${esc(health?.message || 'Start PostgreSQL and configure DATABASE_URL.')} The preview uses example records and does not save changes. For live data, run the SQL setup files and see <a href="https://github.com/amitsonale/ai-driven-cyber-threat-intelligence-dbms/blob/main/README.md" target="_blank" rel="noreferrer">the setup instructions</a>.`;
    banner.classList.remove('hidden');
  }
}
function pageHeading(title, subtitle, right='') {
  return `<div class="page-heading"><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>${right ? `<div class="date-chip">${esc(right)}</div>` : ''}</div>`;
}
function kpi(label, value, foot, symbol, tone='') {
  return `<article class="kpi-card ${tone}"><div class="kpi-label">${esc(label)}<span class="kpi-symbol">${symbol}</span></div><div class="kpi-value">${n(value)}</div><div class="kpi-foot">${esc(foot)}</div></article>`;
}
function alertRows(rows, editable=false) {
  if (!rows?.length) return `<tr><td colspan="7" class="empty-filter">No alerts match these filters.</td></tr>`;
  return rows.map(a => `<tr>
    <td class="mono">AL-${esc(a.alert_id)}</td><td>${badge(a.severity)}</td>
    <td>${editable ? `<select class="status-select" data-alert-id="${esc(a.alert_id)}" data-saved-status="${esc(a.status)}" aria-label="Change status for alert ${esc(a.alert_id)}" ${state.demoMode?'disabled':''}>${['Open','Investigating','Resolved','False Positive'].map(s=>`<option ${s===a.status?'selected':''}>${s}</option>`).join('')}</select>` : badge(a.status)}</td>
    <td><strong>${esc(a.hostname)}</strong><div class="muted">${esc(a.ip_address || '')}</div></td>
    <td><span class="mono">${esc(a.ioc_type)}</span><div class="indicator-value" title="${esc(a.indicator)}">${esc(a.indicator)}</div></td>
    <td>${esc(a.analyst || 'Unassigned')}</td><td class="muted">${date(a.detected_at)}</td>
  </tr>`).join('');
}
function renderOverview(data) {
  const totals = data?.totals || {};
  const severity = data?.severity || [];
  const total = severity.reduce((sum, x) => sum + Number(x.count || 0), 0) || 1;
  const severityMarkup = ['Critical','High','Medium','Low'].map(level => {
    const row = severity.find(x => x.severity === level);
    const count = Number(row?.count || 0);
    return `<div class="severity-row ${level.toLowerCase()}"><span>${level}</span><div class="severity-track"><div class="severity-fill" style="width:${Math.max(count ? 5 : 0, count/total*100)}%"></div></div><span class="severity-count">${n(count)}</span></div>`;
  }).join('');
  const campaignRows = (data?.campaigns || []).map(c => `<div class="campaign-row"><div><div class="campaign-name">${esc(c.campaign_name)}</div><div class="campaign-actor">${esc(c.threat_actor || 'Unattributed')} · ${n(c.indicator_count)} indicators</div></div><div class="score-track"><div class="score-fill" style="width:${pct(Number(c.correlation_score)*100)}%"></div></div><div class="score-value">${(Number(c.correlation_score||0)).toFixed(3)}</div></div>`).join('') || '<div class="empty-filter">No campaign records available.</div>';
  root.innerHTML = `${pageHeading('Overview','A live view of alerts, campaigns, indicators, and protected assets.', state.demoMode ? 'SAMPLE DATA' : 'DATA SOURCES · POSTGRESQL + MONGODB')}
    <div class="kpi-grid">
      ${kpi('Open investigations', totals.open_alerts, 'Open or under investigation', '◉','danger')}
      ${kpi('Critical alerts', totals.critical_alerts, 'Critical and not yet resolved', '!', 'amber')}
      ${kpi('Active campaigns', totals.active_campaigns, 'Active or monitoring', '⌁','blue')}
      ${kpi('Indicators tracked', totals.indicators, `${n(totals.assets)} monitored assets`, '⌕')}
    </div>
    <div class="overview-grid">
      <section class="panel severity-panel"><div class="panel-header"><div><div class="panel-title">Alert severity</div><div class="panel-subtitle">Current alert distribution</div></div><button class="panel-link" data-goto="alerts">View alerts →</button></div><div class="severity-list">${severityMarkup}</div></section>
      <section class="panel"><div class="panel-header"><div><div class="panel-title">Strongest campaign links</div><div class="panel-subtitle">Ranked by stored correlation score</div></div><button class="panel-link" data-goto="campaigns">All campaigns →</button></div><div class="campaign-list">${campaignRows}</div></section>
    </div>
    <section class="panel table-panel"><div class="panel-header"><div><div class="panel-title">Latest alerts</div><div class="panel-subtitle">Most recently detected activity</div></div><button class="panel-link" data-goto="alerts">Open alert queue →</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Alert</th><th>Severity</th><th>Status</th><th>Asset</th><th>Indicator</th><th>Analyst</th><th>Detected</th></tr></thead><tbody>${alertRows(data?.recentAlerts || [])}</tbody></table></div></section>`;
}
function renderAlerts(rows) {
  root.innerHTML = `${pageHeading('Alerts','Review detections and update investigation status.')}
    <section class="panel table-panel"><div class="section-toolbar"><div class="filter-row"><input id="alert-search" class="search-input" type="search" placeholder="Search host, IOC, analyst…" aria-label="Search alerts"><select id="severity-filter" class="filter-select" aria-label="Filter by severity"><option value="">All severities</option>${['Critical','High','Medium','Low'].map(x=>`<option>${x}</option>`).join('')}</select><select id="status-filter" class="filter-select" aria-label="Filter by status"><option value="">All statuses</option>${['Open','Investigating','Resolved','False Positive'].map(x=>`<option>${x}</option>`).join('')}</select></div><span id="alert-result-count" class="result-count">${n(rows.length)} records</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Alert</th><th>Severity</th><th>Status</th><th>Asset</th><th>Indicator</th><th>Analyst</th><th>Detected</th></tr></thead><tbody id="alert-table-body">${alertRows(rows,true)}</tbody></table></div><div class="section-toolbar status-help">${state.demoMode ? 'Sample preview: status changes are disabled.' : 'Changing a status writes to the PostgreSQL audit history trigger.'}</div></section>`;
  const applyFilters = () => {
    const q = document.getElementById('alert-search').value.toLowerCase();
    const sev = document.getElementById('severity-filter').value;
    const stat = document.getElementById('status-filter').value;
    const filtered = rows.filter(a => (!sev || a.severity===sev) && (!stat || a.status===stat) && (!q || [a.hostname,a.ip_address,a.indicator,a.analyst,a.details].some(v=>String(v||'').toLowerCase().includes(q))));
    document.getElementById('alert-table-body').innerHTML = alertRows(filtered,true);
    document.getElementById('alert-result-count').textContent = `${n(filtered.length)} records`;
    bindStatusSelects();
  };
  ['alert-search','severity-filter','status-filter'].forEach(id => document.getElementById(id).addEventListener(id==='alert-search'?'input':'change',applyFilters));
  bindStatusSelects();
}
function bindStatusSelects() {
  document.querySelectorAll('.status-select').forEach(select => {
    select.onchange = async () => {
      const id=select.dataset.alertId;
      const previousStatus=select.dataset.savedStatus;
      select.disabled=true;
      try {
        await api(`/api/alerts/${encodeURIComponent(id)}/status`, {method:'PATCH',body:JSON.stringify({status:select.value})});
        select.dataset.savedStatus=select.value;
        showToast(`Alert AL-${id} status updated.`);
        await loadView('alerts');
      } catch (error) { select.value=previousStatus; showToast(error.message,true); select.disabled=false; }
    };
  });
}
function renderCampaigns(rows) {
  const body = rows.map(c=>`<tr><td><strong>${esc(c.campaign_name)}</strong><div class="muted">ID ${esc(c.campaign_id)}</div></td><td>${esc(c.threat_actor||'Unattributed')}</td><td>${badge(c.status)}</td><td><div class="confidence-cell"><div class="score-track"><div class="score-fill" style="width:${pct(Number(c.correlation_score)*100)}%"></div></div><span class="mono">${Number(c.correlation_score||0).toFixed(3)}</span></div></td><td>${n(c.indicator_count)}</td><td>${n(c.technique_count)}</td><td>${n(c.alert_count)}</td></tr>`).join('');
  root.innerHTML = `${pageHeading('Campaigns','Correlate threat actors with indicators, techniques, and alerts.')}
    <section class="panel table-panel"><div class="section-toolbar"><span class="result-count">${n(rows.length)} campaigns</span><span class="status-help">Scores are normalized values from 0 to 1</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Campaign</th><th>Threat actor</th><th>Status</th><th>Correlation</th><th>Indicators</th><th>Techniques</th><th>Alerts</th></tr></thead><tbody>${body||'<tr><td colspan="7" class="empty-filter">No campaigns found.</td></tr>'}</tbody></table></div></section>`;
}
function renderIndicators(rows) {
  const body=rows.map(i=>`<tr><td class="mono">IOC-${esc(i.indicator_id)}</td><td>${badge(i.ioc_type)}</td><td class="indicator-value mono" title="${esc(i.value)}">${esc(i.value)}</td><td><div class="confidence-cell"><div class="score-track"><div class="score-fill" style="width:${pct(i.confidence_score)}%"></div></div><span class="mono">${Number(i.confidence_score||0).toFixed(0)}%</span></div></td><td>${esc(i.source||'Unknown')}</td><td>${n(i.campaign_count)}</td><td class="muted">${date(i.last_seen)}</td></tr>`).join('');
  root.innerHTML=`${pageHeading('Indicators','Investigate IOCs by type, confidence, source, and campaign links.')}
    <section class="panel table-panel"><div class="section-toolbar"><input id="indicator-search" class="search-input" type="search" placeholder="Search value or type…" aria-label="Search indicators"><span id="indicator-count" class="result-count">${n(rows.length)} indicators</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>ID</th><th>Type</th><th>Indicator value</th><th>Confidence</th><th>Source</th><th>Campaigns</th><th>Last seen</th></tr></thead><tbody id="indicator-body">${body||'<tr><td colspan="7" class="empty-filter">No indicators found.</td></tr>'}</tbody></table></div></section>`;
  document.getElementById('indicator-search').addEventListener('input',e=>{
    const q=e.target.value.toLowerCase(); const filtered=rows.filter(i=>`${i.value} ${i.ioc_type} ${i.source||''}`.toLowerCase().includes(q));
    document.getElementById('indicator-body').innerHTML=filtered.map(i=>`<tr><td class="mono">IOC-${esc(i.indicator_id)}</td><td>${badge(i.ioc_type)}</td><td class="indicator-value mono" title="${esc(i.value)}">${esc(i.value)}</td><td><div class="confidence-cell"><div class="score-track"><div class="score-fill" style="width:${pct(i.confidence_score)}%"></div></div><span class="mono">${Number(i.confidence_score||0).toFixed(0)}%</span></div></td><td>${esc(i.source||'Unknown')}</td><td>${n(i.campaign_count)}</td><td class="muted">${date(i.last_seen)}</td></tr>`).join('')||'<tr><td colspan="7" class="empty-filter">No indicators match that search.</td></tr>';
    document.getElementById('indicator-count').textContent=`${n(filtered.length)} indicators`;
  });
}
function renderAssets(rows) {
  const body=rows.map(a=>`<tr><td class="mono">AST-${esc(a.asset_id)}</td><td><strong>${esc(a.hostname)}</strong><div class="muted mono">${esc(a.ip_address||'')}</div></td><td>${esc(a.organization)}</td><td>${esc(a.asset_type)}</td><td>${badge(a.criticality)}</td><td>${n(a.alert_count)}</td></tr>`).join('');
  root.innerHTML=`${pageHeading('Assets','Review protected systems and the alerts associated with each one.')}
    <section class="panel table-panel"><div class="section-toolbar"><span class="result-count">${n(rows.length)} assets</span><span class="status-help">Ordered by business criticality</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Asset</th><th>Host</th><th>Organization</th><th>Type</th><th>Criticality</th><th>Alerts</th></tr></thead><tbody>${body||'<tr><td colspan="6" class="empty-filter">No assets found.</td></tr>'}</tbody></table></div></section>`;
}
function renderEvidence(rows) {
  const body=rows.map(doc=>`<tr>
    <td class="mono">${esc(doc._id)}</td><td>${badge(doc.indicatorType)}</td>
    <td class="indicator-value mono" title="${esc(doc.indicator)}">${esc(doc.indicator)}</td>
    <td>${esc(doc.source||'Unknown')}</td><td>${n(doc.confidence)}%</td>
    <td class="muted">${date(doc.observedAt)}</td>
    <td>${(doc.tags||[]).map(tag=>badge(tag)).join(' ')}</td>
    <td><code class="evidence-context">${esc(JSON.stringify(doc.context||{}))}</code></td>
  </tr>`).join('');
  root.innerHTML=`${pageHeading('Intel evidence','Flexible source records and nested context stored as MongoDB documents.','MONGODB DOCUMENT STORE')}
    <section class="panel table-panel"><div class="section-toolbar"><span class="result-count">${n(rows.length)} evidence documents</span><span class="status-help">MongoDB · threat_evidence collection</span></div><div class="table-wrap"><table class="data-table evidence-table"><thead><tr><th>Document ID</th><th>Type</th><th>Indicator</th><th>Source</th><th>Confidence</th><th>Observed</th><th>Tags</th><th>Flexible context</th></tr></thead><tbody>${body||'<tr><td colspan="8" class="empty-filter">No evidence documents found. Run npm run seed:mongodb.</td></tr>'}</tbody></table></div><div class="section-toolbar status-help">Each document links to its normalized PostgreSQL indicator using the stored indicator ID.</div></section>`;
}
async function loadView(view=state.view) {
  state.view=view;
  document.querySelectorAll('.nav-item').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
  root.innerHTML='<div class="loading-state"><span class="spinner"></span><span>Loading threat data…</span></div>';
  try {
    if(view==='overview'){state.overview=await api('/api/overview');state.demoMode=false;renderOverview(state.overview);document.getElementById('nav-alert-count').textContent=n(state.overview.totals.open_alerts);}
    if(view==='alerts'){state.alerts=await api('/api/alerts');renderAlerts(state.alerts);}
    if(view==='campaigns'){state.campaigns=await api('/api/campaigns');renderCampaigns(state.campaigns);}
    if(view==='indicators'){state.indicators=await api('/api/indicators');renderIndicators(state.indicators);}
    if(view==='assets'){state.assets=await api('/api/assets');renderAssets(state.assets);}
    if(view==='evidence'){state.evidence=await api('/api/evidence');renderEvidence(state.evidence);}
    document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>loadView(b.dataset.goto)));
  } catch(error) {
    const health=await api('/api/health').catch(()=>({connected:false,message:error.message}));
    setConnection(health);
    if (!health.connected) {
      state.demoMode=true;
      if(view==='overview') renderOverview(DEMO.overview);
      if(view==='alerts') renderAlerts(DEMO.alerts);
      if(view==='campaigns') renderCampaigns(DEMO.campaigns);
      if(view==='indicators') renderIndicators(DEMO.indicators);
      if(view==='assets') renderAssets(DEMO.assets);
      if(view==='evidence') root.innerHTML=`${pageHeading('Intel evidence','MongoDB evidence store is unavailable.')}`;
      document.getElementById('nav-alert-count').textContent=n(DEMO.overview.totals.open_alerts);
      return;
    }
    root.innerHTML=`<div class="empty-state">${esc(error.message)}. Check the local database setup, then refresh.</div>`;
  }
}
async function refresh() {
  const health=await api('/api/health').catch(error=>({connected:false,message:error.message}));
  setConnection(health);
  await loadView(state.view);
}
document.querySelectorAll('.nav-item').forEach(button=>button.addEventListener('click',()=>loadView(button.dataset.view)));
document.getElementById('refresh-button').addEventListener('click',refresh);
api('/api/health').then(setConnection).catch(error=>setConnection({connected:false,message:error.message}));
loadView('overview');
