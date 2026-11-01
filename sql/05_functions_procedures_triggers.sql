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
