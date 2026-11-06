-- Supporting routines and audit triggers for the reconstructed implementation.

CREATE OR REPLACE FUNCTION classify_alert_priority(p_severity TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT CASE p_severity
        WHEN 'Critical' THEN 'Immediate Action'
        WHEN 'High' THEN 'High Priority'
        WHEN 'Medium' THEN 'Monitor'
        WHEN 'Low' THEN 'Low Priority'
        ELSE 'Unknown'
    END;
$$;

CREATE OR REPLACE FUNCTION touch_alert_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION audit_alert_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO alert_status_history (alert_id, old_status, new_status, changed_by)
        VALUES (NEW.alert_id, OLD.status, NEW.status, NEW.assigned_user_id);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_alert_touch_updated_at ON alert;
CREATE TRIGGER trg_alert_touch_updated_at
BEFORE UPDATE ON alert
FOR EACH ROW EXECUTE FUNCTION touch_alert_updated_at();

DROP TRIGGER IF EXISTS trg_alert_status_audit ON alert;
CREATE TRIGGER trg_alert_status_audit
AFTER UPDATE OF status ON alert
FOR EACH ROW EXECUTE FUNCTION audit_alert_status_change();

CREATE OR REPLACE FUNCTION get_campaign_indicator_count(p_campaign_id INTEGER)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
    SELECT COUNT(*)::INTEGER
    FROM campaign_indicator
    WHERE campaign_id = p_campaign_id;
$$;

CREATE OR REPLACE PROCEDURE close_campaign_alerts(
    IN p_campaign_id INTEGER,
    IN p_user_id INTEGER,
    OUT p_rows_updated INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE alert AS a
       SET status = 'Resolved', assigned_user_id = p_user_id
      FROM campaign_indicator AS ci
     WHERE ci.campaign_id = p_campaign_id
       AND ci.indicator_id = a.indicator_id
       AND a.status IN ('Open', 'Investigating');
    GET DIAGNOSTICS p_rows_updated = ROW_COUNT;
END;
$$;

-- AI-Driven Dynamic Campaign Correlation Stored Procedure
-- Aggregates IOC confidence, intel source reliability, TTP technique breadth,
-- and real-world alert telemetry into a multi-factor correlation score (0.000 to 1.000).
CREATE OR REPLACE PROCEDURE calculate_campaign_correlations()
LANGUAGE plpgsql
AS $$
DECLARE
    r RECORD;
    v_avg_ioc_conf NUMERIC;
    v_avg_src_rel NUMERIC;
    v_ttp_count INTEGER;
    v_alert_count INTEGER;
    v_new_score NUMERIC(5,3);
BEGIN
    FOR r IN SELECT campaign_id FROM campaign LOOP
        -- 1. Average confidence of linked indicators (scaled 0.0 to 1.0)
        SELECT COALESCE(AVG(i.confidence_score) / 100.0, 0.50)
          INTO v_avg_ioc_conf
          FROM campaign_indicator ci
          JOIN indicator i ON i.indicator_id = ci.indicator_id
         WHERE ci.campaign_id = r.campaign_id;

        -- 2. Average reliability of sources providing those indicators
        SELECT COALESCE(AVG(s.reliability_score), 0.50)
          INTO v_avg_src_rel
          FROM campaign_indicator ci
          JOIN indicator i ON i.indicator_id = ci.indicator_id
          LEFT JOIN intel_source s ON s.source_id = i.source_id
         WHERE ci.campaign_id = r.campaign_id;

        -- 3. Quantity of linked MITRE ATT&CK techniques (TTPs)
        SELECT COUNT(DISTINCT ttp_id)
          INTO v_ttp_count
          FROM campaign_ttp
         WHERE campaign_id = r.campaign_id;

        -- 4. Quantity of detected alerts matching campaign indicators
        SELECT COUNT(DISTINCT a.alert_id)
          INTO v_alert_count
          FROM campaign_indicator ci
          JOIN alert a ON a.indicator_id = ci.indicator_id
         WHERE ci.campaign_id = r.campaign_id;

        -- Multi-factor weighted correlation formula:
        -- 40% IOC Confidence + 25% Source Reliability + 20% TTP Depth + 15% Alert Verification
        v_new_score := LEAST(1.000, GREATEST(0.050,
            (v_avg_ioc_conf * 0.40) +
            (v_avg_src_rel * 0.25) +
            (LEAST(v_ttp_count, 5)::NUMERIC / 5.0 * 0.20) +
            (LEAST(v_alert_count, 5)::NUMERIC / 5.0 * 0.15)
        ));

        -- Update the campaign record
        UPDATE campaign
           SET correlation_score = ROUND(v_new_score, 3)
         WHERE campaign_id = r.campaign_id;

        -- Also update per-indicator correlation scores within the campaign
        UPDATE campaign_indicator ci
           SET correlation_score = ROUND(LEAST(1.000, (i.confidence_score / 100.0 * 0.60 + COALESCE(s.reliability_score, 0.50) * 0.40)), 3)
          FROM indicator i
          LEFT JOIN intel_source s ON s.source_id = i.source_id
         WHERE ci.campaign_id = r.campaign_id
           AND i.indicator_id = ci.indicator_id;
    END LOOP;
END;
$$;
