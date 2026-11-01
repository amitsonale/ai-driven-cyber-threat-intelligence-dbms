-- Representative SQL examples recovered from the report text.
-- This is not the original complete implementation; see sql/README.md.

-- Aggregate alerts by severity.
SELECT severity, COUNT(*) AS alert_count
FROM alert
GROUP BY severity
ORDER BY alert_count DESC;

-- Update and verify an alert.
UPDATE alert
SET status = 'Investigating'
WHERE asset_id = 1
  AND indicator_id = 1;

SELECT alert_id, asset_id, indicator_id, severity, status
FROM alert
WHERE asset_id = 1 AND indicator_id = 1;

-- Find indicators with confidence above the overall average.
SELECT indicator_id, ioc_type, value, confidence_score
FROM indicator
WHERE confidence_score > (
    SELECT AVG(confidence_score)
    FROM indicator
);

-- Classify alerts by priority.
SELECT alert_id, severity, status,
       CASE
           WHEN severity = 'Critical' THEN 'Immediate Action'
           WHEN severity = 'High' THEN 'High Priority'
           WHEN severity = 'Medium' THEN 'Monitor'
           ELSE 'Low Priority'
       END AS priority_level
FROM alert
ORDER BY alert_id;

-- Correlated campaign query shown as a report example. Confirm that
-- correlation_score exists in the final schema before running.
SELECT c.campaign_id, c.name, c.actor_id, c.correlation_score
FROM campaign AS c
WHERE c.correlation_score > (
    SELECT AVG(c2.correlation_score)
    FROM campaign AS c2
    WHERE c2.actor_id = c.actor_id
);
