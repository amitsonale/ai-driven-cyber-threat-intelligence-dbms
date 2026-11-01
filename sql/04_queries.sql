-- Demonstration queries for the project. Run after 01_schema.sql to 03_views_indexes.sql.

-- 1. Base data retrieval.
SELECT user_id, full_name, email, role FROM app_user ORDER BY user_id;
SELECT asset_id, org_id, hostname, ip_address, criticality FROM asset ORDER BY asset_id;
SELECT actor_id, name, aliases, origin_country, sophistication FROM threat_actor ORDER BY actor_id;
SELECT source_id, name, source_type, reliability_score FROM intel_source ORDER BY source_id;
SELECT indicator_id, ioc_type, value, confidence_score FROM indicator ORDER BY indicator_id;
SELECT campaign_id, name, actor_id, status, correlation_score FROM campaign ORDER BY campaign_id;
SELECT technique_id, name, tactic FROM ttp ORDER BY technique_id;
SELECT malware_id, family_name, sha256_hash, file_type FROM malware_sample ORDER BY malware_id;
SELECT cve_id, cvss_score, description FROM vulnerability ORDER BY cve_id;

-- 2. Multi-table relationship joins.
SELECT m.family_name, v.cve_id, v.cvss_score
FROM malware_sample AS m
JOIN malware_vuln AS mv ON mv.malware_id = m.malware_id
JOIN vulnerability AS v ON v.vulnerability_id = mv.vulnerability_id
ORDER BY m.family_name, v.cve_id;

SELECT c.name AS campaign, i.ioc_type, i.value, i.confidence_score
FROM campaign AS c
JOIN campaign_indicator AS ci ON ci.campaign_id = c.campaign_id
JOIN indicator AS i ON i.indicator_id = ci.indicator_id
ORDER BY c.name, i.indicator_id;

SELECT c.name AS campaign, t.technique_id, t.name AS technique, t.tactic
FROM campaign AS c
JOIN campaign_ttp AS ct ON ct.campaign_id = c.campaign_id
JOIN ttp AS t ON t.ttp_id = ct.ttp_id
ORDER BY c.name, t.technique_id;

SELECT i.value AS indicator, m.family_name AS malware
FROM indicator AS i
JOIN indicator_malware AS im ON im.indicator_id = i.indicator_id
JOIN malware_sample AS m ON m.malware_id = im.malware_id
ORDER BY i.indicator_id;

SELECT a.alert_id, ast.hostname, i.ioc_type, i.value, a.severity, a.status,
       u.full_name AS assigned_analyst
FROM alert AS a
JOIN asset AS ast ON ast.asset_id = a.asset_id
JOIN indicator AS i ON i.indicator_id = a.indicator_id
LEFT JOIN app_user AS u ON u.user_id = a.assigned_user_id
ORDER BY a.alert_id;

SELECT r.report_id, r.title, u.full_name AS author, c.name AS campaign
FROM report AS r
LEFT JOIN app_user AS u ON u.user_id = r.user_id
LEFT JOIN campaign AS c ON c.campaign_id = r.campaign_id
ORDER BY r.report_id;

-- 3. Update and verify one alert (trigger logs its status change).
UPDATE alert
SET status = 'Investigating', assigned_user_id = 1
WHERE alert_id = 9;

SELECT alert_id, asset_id, indicator_id, severity, status, updated_at
FROM alert
WHERE alert_id = 9;

-- 4. Aggregates, HAVING, and average confidence.
SELECT severity, COUNT(*) AS alert_count
FROM alert
GROUP BY severity
ORDER BY alert_count DESC;

SELECT org.name AS organization, COUNT(a.alert_id) AS alert_count
FROM organization AS org
JOIN asset AS ast ON ast.org_id = org.org_id
JOIN alert AS a ON a.asset_id = ast.asset_id
GROUP BY org.org_id, org.name
HAVING COUNT(a.alert_id) >= 2
ORDER BY alert_count DESC;

SELECT source_type, ROUND(AVG(reliability_score), 2) AS average_reliability
FROM intel_source
GROUP BY source_type
ORDER BY source_type;

SELECT ROUND(AVG(confidence_score), 2) AS average_indicator_confidence
FROM indicator;

-- 5. Nested query: indicators above the overall confidence average.
SELECT indicator_id, ioc_type, value, confidence_score
FROM indicator
WHERE confidence_score > (SELECT AVG(confidence_score) FROM indicator)
ORDER BY confidence_score DESC;

-- 6. Correlated query: campaigns above their actor's average score.
SELECT c.campaign_id, c.name, c.actor_id, c.correlation_score
FROM campaign AS c
WHERE c.correlation_score > (
    SELECT AVG(c2.correlation_score)
    FROM campaign AS c2
    WHERE c2.actor_id = c.actor_id
)
ORDER BY c.correlation_score DESC;

-- 7. CASE priority classification.
SELECT alert_id, severity, status,
       CASE
           WHEN severity = 'Critical' THEN 'Immediate Action'
           WHEN severity = 'High' THEN 'High Priority'
           WHEN severity = 'Medium' THEN 'Monitor'
           ELSE 'Low Priority'
       END AS priority_level
FROM alert
ORDER BY alert_id;

-- 8. View retrieval.
SELECT * FROM campaign_threat_summary ORDER BY correlation_score DESC;

-- 9. EXISTS and NOT EXISTS examples.
SELECT c.campaign_id, c.name
FROM campaign AS c
WHERE EXISTS (
    SELECT 1 FROM campaign_indicator AS ci
    WHERE ci.campaign_id = c.campaign_id
)
ORDER BY c.campaign_id;

SELECT ast.asset_id, ast.hostname
FROM asset AS ast
WHERE NOT EXISTS (
    SELECT 1 FROM alert AS a
    WHERE a.asset_id = ast.asset_id AND a.status = 'Resolved'
)
ORDER BY ast.asset_id;

-- 10. High/Critical alerts, strong correlations, and final joined correlation view.
SELECT alert_id, severity, status, detected_at
FROM alert
WHERE severity IN ('High', 'Critical')
ORDER BY detected_at DESC;

SELECT campaign_id, name, actor_id, correlation_score
FROM campaign
WHERE correlation_score >= 75
ORDER BY correlation_score DESC;

SELECT c.name AS campaign, ta.name AS threat_actor,
       i.ioc_type, i.value AS indicator, i.confidence_score,
       m.family_name AS malware, a.severity, a.status, ast.hostname
FROM campaign AS c
JOIN threat_actor AS ta ON ta.actor_id = c.actor_id
JOIN campaign_indicator AS ci ON ci.campaign_id = c.campaign_id
JOIN indicator AS i ON i.indicator_id = ci.indicator_id
LEFT JOIN indicator_malware AS im ON im.indicator_id = i.indicator_id
LEFT JOIN malware_sample AS m ON m.malware_id = im.malware_id
LEFT JOIN alert AS a ON a.indicator_id = i.indicator_id
LEFT JOIN asset AS ast ON ast.asset_id = a.asset_id
WHERE c.correlation_score >= 70
ORDER BY c.correlation_score DESC, i.confidence_score DESC;

-- 11. Safe DELETE pattern. Replace the key after reviewing dependencies.
-- DELETE FROM campaign_indicator
-- WHERE campaign_id = 1 AND indicator_id = 1;
