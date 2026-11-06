
# Database Architecture and Integration

## 1. Project Overview

The AI-Driven Cyber Threat Intelligence and Attack Campaign Correlation System uses a dual-database architecture consisting of PostgreSQL and MongoDB.

The architecture combines relational data management with flexible document storage to support efficient cyber threat intelligence analysis.

## 2. PostgreSQL Database

PostgreSQL manages structured and relational information.

It stores:
- Organizations
- Application users
- Threat actors
- Threat campaigns
- Indicators of Compromise (IOCs)
- Organizational assets
- Security alerts
- MITRE ATT&CK techniques
- Malware samples
- Vulnerabilities
- Audit records

Primary keys, foreign keys, constraints, joins, indexes, views, functions and triggers maintain data consistency.

## 3. MongoDB Database

MongoDB stores flexible cyber threat intelligence evidence.

The threat_evidence collection contains:
- Evidence descriptions
- Source information
- Nested source context
- Threat intelligence tags
- Indicator references

Its document-oriented structure supports different evidence formats without requiring a fixed relational schema.

## 4. Database Integration

The two databases work together:

1. PostgreSQL stores the main indicator records.
2. MongoDB stores detailed evidence documents.
3. Each MongoDB evidence document references its corresponding PostgreSQL indicator ID.
4. The dashboard retrieves structured information from PostgreSQL and supporting evidence from MongoDB.

## 5. AI Campaign Correlation

The project calculates campaign correlation scores using four factors:

- Indicator confidence: 40%
- Intelligence source reliability: 25%
- MITRE ATT&CK technique diversity: 20%
- Alert verification: 15%

The final score is normalized between 0 and 1.

## 6. Conclusion

The integration of PostgreSQL and MongoDB provides a combination of relational consistency and flexible evidence storage.

This architecture supports cyber threat monitoring, indicator tracking, attack campaign correlation and security analysis through a unified dashboard.
