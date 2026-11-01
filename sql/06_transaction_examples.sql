-- Transaction examples. Run against the sample data after setup.

-- Savepoint rollback while retaining an earlier update; the final COMMIT persists it.
BEGIN;
UPDATE alert SET status = 'Investigating' WHERE alert_id = 12;
SAVEPOINT before_second_change;
UPDATE alert SET status = 'Resolved' WHERE alert_id = 14;
ROLLBACK TO SAVEPOINT before_second_change;
COMMIT;

-- Full rollback example; this second update is intentionally discarded.
BEGIN;
UPDATE alert SET status = 'Resolved' WHERE alert_id = 15;
ROLLBACK;

-- Function and procedure calls (run after 05_functions_procedures_triggers.sql).
SELECT classify_alert_priority('Critical') AS priority;
SELECT get_campaign_indicator_count(1) AS linked_indicators;
CALL close_campaign_alerts(5, 1, NULL);
