-- Reusable reporting view and targeted lookup indexes.

CREATE OR REPLACE VIEW campaign_threat_summary AS
SELECT c.campaign_id,
       c.name AS campaign_name,
       ta.name AS threat_actor,
       c.status,
       c.correlation_score,
       COUNT(DISTINCT ci.indicator_id) AS indicator_count,
       COUNT(DISTINCT ct.ttp_id) AS technique_count,
       COUNT(DISTINCT a.alert_id) AS alert_count
FROM campaign AS c
LEFT JOIN threat_actor AS ta ON ta.actor_id = c.actor_id
LEFT JOIN campaign_indicator AS ci ON ci.campaign_id = c.campaign_id
LEFT JOIN campaign_ttp AS ct ON ct.campaign_id = c.campaign_id
LEFT JOIN indicator AS i ON i.indicator_id = ci.indicator_id
LEFT JOIN alert AS a ON a.indicator_id = i.indicator_id
GROUP BY c.campaign_id, c.name, ta.name, c.status, c.correlation_score;

CREATE INDEX IF NOT EXISTS idx_asset_org ON asset(org_id);
CREATE INDEX IF NOT EXISTS idx_campaign_actor ON campaign(actor_id);
CREATE INDEX IF NOT EXISTS idx_campaign_status_score ON campaign(status, correlation_score DESC);
CREATE INDEX IF NOT EXISTS idx_indicator_confidence ON indicator(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_indicator_source ON indicator(source_id);
CREATE INDEX IF NOT EXISTS idx_indicator_value ON indicator(value);
CREATE INDEX IF NOT EXISTS idx_alert_severity ON alert(severity);
CREATE INDEX IF NOT EXISTS idx_alert_status_severity ON alert(status, severity);
CREATE INDEX IF NOT EXISTS idx_alert_detected_at ON alert(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_malware_hash ON malware_sample(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_report_campaign ON report(campaign_id);
CREATE INDEX IF NOT EXISTS idx_history_alert_changed_at ON alert_status_history(alert_id, changed_at DESC);
