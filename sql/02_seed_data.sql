-- Illustrative data for demonstrations. Intended for a fresh database.

INSERT INTO organization (org_id, name, industry, headquarters) VALUES
(1, 'Northstar Finance', 'Finance', 'Bengaluru'),
(2, 'Meridian Health', 'Healthcare', 'Mysuru'),
(3, 'PES University', 'Education', 'Bengaluru')
ON CONFLICT (org_id) DO NOTHING;

INSERT INTO app_user (user_id, full_name, email, role) VALUES
(1, 'Amit', 'amit.analyst@example.edu', 'Analyst'),
(2, 'M. Sangamesh Prasad', 'sangamesh.analyst@example.edu', 'Analyst'),
(3, 'DB Administrator', 'db.admin@example.edu', 'Admin')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO threat_actor (actor_id, name, aliases, origin_country, sophistication, description) VALUES
(1, 'APT29', 'Cozy Bear; The Dukes', 'Russia', 'Advanced', 'State-aligned threat actor used for project demonstrations.'),
(2, 'Lazarus Group', 'Hidden Cobra', 'North Korea', 'Advanced', 'Threat actor associated with financially motivated and espionage activity.'),
(3, 'FIN7', 'Carbanak Group', 'Unknown', 'High', 'Threat actor associated with financially motivated campaigns.'),
(4, 'TA505', 'Cobalt Group', 'Unknown', 'High', 'Threat actor used in sample campaign records.')
ON CONFLICT (actor_id) DO NOTHING;

INSERT INTO intel_source (source_id, name, source_type, reliability_score, source_url) VALUES
(1, 'Open Threat Feed', 'OSINT', 0.82, 'https://example.org/feed'),
(2, 'Internal SOC', 'Internal', 0.95, NULL),
(3, 'Regional ISAC', 'ISAC', 0.90, NULL),
(4, 'Vendor Intelligence', 'Commercial', 0.88, NULL)
ON CONFLICT (source_id) DO NOTHING;

INSERT INTO asset (asset_id, org_id, hostname, ip_address, asset_type, criticality) VALUES
(1, 1, 'fin-app-01', '10.10.1.10', 'Application Server', 'Critical'),
(2, 1, 'fin-db-01', '10.10.1.20', 'Database Server', 'Critical'),
(3, 1, 'fin-ws-14', '10.10.2.14', 'Workstation', 'High'),
(4, 2, 'health-portal-01', '10.20.1.10', 'Web Server', 'High'),
(5, 2, 'health-lab-03', '10.20.2.33', 'Workstation', 'Medium'),
(6, 3, 'pes-lms-01', '10.30.1.10', 'Application Server', 'High'),
(7, 3, 'pes-library-02', '10.30.2.12', 'Server', 'Medium')
ON CONFLICT (asset_id) DO NOTHING;

INSERT INTO indicator (indicator_id, source_id, ioc_type, value, confidence_score, first_seen, last_seen) VALUES
(1, 1, 'IP', '198.51.100.24', 92.00, '2025-01-03 09:00+00', '2025-01-09 11:00+00'),
(2, 2, 'Domain', 'login-update.example', 76.00, '2025-01-04 08:00+00', '2025-01-08 16:30+00'),
(3, 3, 'Hash', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 88.00, '2025-01-05 10:00+00', '2025-01-06 12:00+00'),
(4, 4, 'URL', 'https://cdn.example/download.bin', 65.00, '2025-01-06 07:00+00', '2025-01-07 12:00+00'),
(5, 1, 'IP', '203.0.113.77', 54.00, '2025-01-07 13:00+00', '2025-01-10 08:00+00'),
(6, 2, 'Email', 'security-notice@example.net', 81.00, '2025-01-08 06:00+00', '2025-01-08 18:00+00'),
(7, 3, 'Domain', 'sync-service.example', 43.00, '2025-01-09 10:00+00', '2025-01-11 10:00+00'),
(8, 4, 'Hash', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 96.00, '2025-01-10 14:00+00', '2025-01-12 20:00+00')
ON CONFLICT (indicator_id) DO NOTHING;

INSERT INTO campaign (campaign_id, actor_id, name, objective, start_date, end_date, status, correlation_score) VALUES
(1, 1, 'Blue Lantern', 'Credential theft and access persistence', '2025-01-01', '2025-02-15', 'Active', 0.950),
(2, 1, 'Winter Harbor', 'Targeted collection against finance systems', '2025-02-01', '2025-03-10', 'Monitoring', 0.910),
(3, 2, 'Silent Orbit', 'Malware delivery and data collection', '2025-01-20', '2025-03-01', 'Active', 0.880),
(4, 3, 'Copper Trail', 'Payment system intrusion attempts', '2025-03-01', NULL, 'Monitoring', 0.840),
(5, 4, 'Amber Mist', 'Phishing and follow-on activity', '2025-03-12', NULL, 'Active', 0.790)
ON CONFLICT (campaign_id) DO NOTHING;

INSERT INTO ttp (ttp_id, technique_id, name, tactic, description) VALUES
(1, 'T1566.001', 'Spearphishing Attachment', 'Initial Access', 'Delivery through a targeted attachment.'),
(2, 'T1059.001', 'PowerShell', 'Execution', 'Command and scripting interpreter.'),
(3, 'T1071.001', 'Web Protocols', 'Command and Control', 'Application layer protocol over web traffic.'),
(4, 'T1003.001', 'LSASS Memory', 'Credential Access', 'Credential dumping from LSASS memory.'),
(5, 'T1027', 'Obfuscated Files or Information', 'Defense Evasion', 'Obfuscation of files or information.')
ON CONFLICT (ttp_id) DO NOTHING;

INSERT INTO malware_sample (malware_id, sha256_hash, family_name, file_type, first_seen) VALUES
(1, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Northwind', 'PE32', '2025-01-05'),
(2, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'Redwood', 'DLL', '2025-01-10'),
(3, 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', 'GlassLoader', 'Script', '2025-02-02'),
(4, 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', 'QuietDrop', 'PE32', '2025-02-20')
ON CONFLICT (malware_id) DO NOTHING;

INSERT INTO vulnerability (vulnerability_id, cve_id, cvss_score, description, published_on) VALUES
(1, 'CVE-2021-44228', 10.0, 'Remote code execution vulnerability in a logging library.', '2021-12-10'),
(2, 'CVE-2023-34362', 9.8, 'SQL injection vulnerability in a file transfer product.', '2023-06-02'),
(3, 'CVE-2022-30190', 7.8, 'Remote code execution vulnerability in a diagnostics tool.', '2022-05-30'),
(4, 'CVE-2024-3400', 10.0, 'Command injection vulnerability affecting a security appliance.', '2024-04-12')
ON CONFLICT (vulnerability_id) DO NOTHING;

INSERT INTO alert (alert_id, asset_id, indicator_id, assigned_user_id, severity, status, detected_at, details) VALUES
(9, 1, 1, 1, 'High', 'Open', '2025-01-09 10:00+00', 'Outbound connection to a high-confidence IP indicator.'),
(10, 2, 3, 2, 'Critical', 'Investigating', '2025-01-10 11:00+00', 'Known malware hash observed on a database server.'),
(11, 3, 2, 1, 'Medium', 'Resolved', '2025-01-11 12:00+00', 'Suspicious domain blocked and contained.'),
(12, 4, 4, 2, 'High', 'Open', '2025-01-12 13:00+00', 'Download URL matched intelligence feed.'),
(13, 5, 5, 1, 'Low', 'False Positive', '2025-01-13 14:00+00', 'Low-confidence indicator reviewed by analyst.'),
(14, 6, 6, 2, 'Critical', 'Investigating', '2025-01-14 15:00+00', 'Phishing message linked to an active campaign.'),
(15, 7, 7, 1, 'Medium', 'Open', '2025-01-15 16:00+00', 'Unusual domain lookup requiring monitoring.'),
(16, 1, 8, 2, 'High', 'Open', '2025-01-16 17:00+00', 'Malware hash associated with campaign activity.')
ON CONFLICT (alert_id) DO NOTHING;

INSERT INTO report (report_id, user_id, campaign_id, title, summary, created_at) VALUES
(1, 1, 1, 'Blue Lantern Initial Assessment', 'Initial correlation of campaign indicators and affected assets.', '2025-01-16 09:00+00'),
(2, 2, 3, 'Silent Orbit Malware Review', 'Malware and vulnerability links for investigation.', '2025-01-18 11:00+00'),
(3, 1, 2, 'Winter Harbor Update', 'Updated confidence and campaign activity summary.', '2025-02-12 10:00+00')
ON CONFLICT (report_id) DO NOTHING;

INSERT INTO campaign_indicator (campaign_id, indicator_id, correlation_score) VALUES
(1,1,0.950),(1,2,0.920),(1,6,0.910),
(2,1,0.910),(2,5,0.790),
(3,3,0.880),(3,4,0.840),(3,8,0.880),
(4,5,0.790),(5,2,0.820),(5,7,0.700)
ON CONFLICT DO NOTHING;

INSERT INTO campaign_ttp (campaign_id, ttp_id) VALUES
(1,1),(1,2),(1,4),(2,3),(2,4),(3,1),(3,3),(3,5),(4,2),(5,1),(5,3)
ON CONFLICT DO NOTHING;

INSERT INTO indicator_malware (indicator_id, malware_id) VALUES
(3,1),(8,2),(4,3),(6,4)
ON CONFLICT DO NOTHING;

INSERT INTO malware_vuln (malware_id, vulnerability_id) VALUES
(1,1),(1,3),(2,2),(3,4),(4,3)
ON CONFLICT DO NOTHING;

-- Advance generated identity sequences after inserting explicit sample IDs.
SELECT setval(pg_get_serial_sequence('organization','org_id'), COALESCE((SELECT MAX(org_id) FROM organization), 1), true);
SELECT setval(pg_get_serial_sequence('app_user','user_id'), COALESCE((SELECT MAX(user_id) FROM app_user), 1), true);
SELECT setval(pg_get_serial_sequence('threat_actor','actor_id'), COALESCE((SELECT MAX(actor_id) FROM threat_actor), 1), true);
SELECT setval(pg_get_serial_sequence('intel_source','source_id'), COALESCE((SELECT MAX(source_id) FROM intel_source), 1), true);
SELECT setval(pg_get_serial_sequence('asset','asset_id'), COALESCE((SELECT MAX(asset_id) FROM asset), 1), true);
SELECT setval(pg_get_serial_sequence('indicator','indicator_id'), COALESCE((SELECT MAX(indicator_id) FROM indicator), 1), true);
SELECT setval(pg_get_serial_sequence('campaign','campaign_id'), COALESCE((SELECT MAX(campaign_id) FROM campaign), 1), true);
SELECT setval(pg_get_serial_sequence('ttp','ttp_id'), COALESCE((SELECT MAX(ttp_id) FROM ttp), 1), true);
SELECT setval(pg_get_serial_sequence('malware_sample','malware_id'), COALESCE((SELECT MAX(malware_id) FROM malware_sample), 1), true);
SELECT setval(pg_get_serial_sequence('vulnerability','vulnerability_id'), COALESCE((SELECT MAX(vulnerability_id) FROM vulnerability), 1), true);
SELECT setval(pg_get_serial_sequence('alert','alert_id'), COALESCE((SELECT MAX(alert_id) FROM alert), 1), true);
SELECT setval(pg_get_serial_sequence('report','report_id'), COALESCE((SELECT MAX(report_id) FROM report), 1), true);
