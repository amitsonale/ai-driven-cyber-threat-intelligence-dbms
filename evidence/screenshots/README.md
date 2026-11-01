# Screenshot Gallery

This gallery documents every terminal screenshot retained from the supplied project execution report. Each caption explains the SQL operation or database result visible in the image. Screenshots are numbered here for navigation; the number is not the figure number from the source PDF.

## Core records and schema

### Screenshot 01 — User records

Shows the inserted analysts and account fields returned from the user table.

![Screenshot 01: User records](page-02-shot-01.png)

### Screenshot 02 — Organizational assets

Lists asset IDs, organization links, hostnames, IP addresses, and criticality.

![Screenshot 02: Organizational assets](page-02-shot-02.png)

### Screenshot 03 — Threat actor records

Shows the threat actor rows and attributes such as aliases, origin country, and sophistication.

![Screenshot 03: Threat actor records](page-03-shot-01.png)

### Screenshot 04 — Combined psql session and schema inspection

A broader terminal capture with base-data commands and the intel_source table definition, including its columns and constraints.

![Screenshot 04: Combined psql session and schema inspection](page-03-shot-02.png)

### Screenshot 05 — Intelligence source records

Lists intelligence feeds, source types, and reliability scores.

![Screenshot 05: Intelligence source records](page-04-shot-01.png)

### Screenshot 06 — Indicators of compromise (IOCs)

Shows IOC types and values together with source, confidence, and observed dates.

![Screenshot 06: Indicators of compromise (IOCs)](page-04-shot-02.png)

### Screenshot 07 — Attack campaign records

Lists campaigns, their associated actors, objectives, dates, and statuses.

![Screenshot 07: Attack campaign records](page-04-shot-03.png)

### Screenshot 08 — MITRE ATT&CK techniques (TTPs)

Shows technique IDs, tactics, and technique names.

![Screenshot 08: MITRE ATT&CK techniques (TTPs)](page-05-shot-01.png)

### Screenshot 09 — Malware sample records

Lists malware hashes, family names, file types, and first-seen dates.

![Screenshot 09: Malware sample records](page-05-shot-02.png)

### Screenshot 10 — Malware and vulnerability join

Connects malware samples to CVEs and returns vulnerability scores and descriptions.

![Screenshot 10: Malware and vulnerability join](page-05-shot-03.png)

## Relationship queries

### Screenshot 11 — Campaign and indicator join

Lists indicators associated with each campaign, including confidence and correlation values.

![Screenshot 11: Campaign and indicator join](page-06-shot-01.png)

### Screenshot 12 — Campaign and TTP join

Shows the techniques linked to each campaign and the corresponding tactics.

![Screenshot 12: Campaign and TTP join](page-06-shot-02.png)

### Screenshot 13 — Indicator and malware join

Connects IOC records to malware families and file types.

![Screenshot 13: Indicator and malware join](page-06-shot-03.png)

### Screenshot 14 — Alert, asset, indicator, and analyst join

Combines alert severity and status with affected host, matched IOC, and assigned analyst.

![Screenshot 14: Alert, asset, indicator, and analyst join](page-07-shot-01.png)

### Screenshot 15 — Report, author, and campaign join

Lists reports with their author, campaign, classification, and publication date.

![Screenshot 15: Report, author, and campaign join](page-07-shot-02.png)

## Updates and analytical queries

### Screenshot 16 — Alert status update

Updates an alert to Investigating and queries the row to confirm the new status.

![Screenshot 16: Alert status update](page-08-shot-01.png)

### Screenshot 17 — Alert count by severity

Uses GROUP BY and COUNT to summarize alerts in each severity category.

![Screenshot 17: Alert count by severity](page-08-shot-02.png)

### Screenshot 18 — Campaign count with HAVING

Groups indicators by campaign and filters the groups with a HAVING condition.

![Screenshot 18: Campaign count with HAVING](page-09-shot-01.png)

### Screenshot 19 — Average indicator confidence by IOC type

Uses AVG with GROUP BY to compare confidence across IOC types.

![Screenshot 19: Average indicator confidence by IOC type](page-09-shot-02.png)

## Advanced SQL

### Screenshot 20 — Indicators above average confidence

Uses a nested subquery to return indicators whose confidence exceeds the overall average.

![Screenshot 20: Indicators above average confidence](page-10-shot-01.png)

### Screenshot 21 — Campaigns above their actor’s average correlation

Uses a correlated subquery to compare each campaign with the average score for its threat actor.

![Screenshot 21: Campaigns above their actor’s average correlation](page-10-shot-02.png)

### Screenshot 22 — CASE-based alert priority

Maps alert severities to human-readable priority labels with a CASE expression.

![Screenshot 22: CASE-based alert priority](page-11-shot-01.png)

### Screenshot 23 — Campaign threat summary view

Queries the view that summarizes campaign, actor, indicator, and correlation information.

![Screenshot 23: Campaign threat summary view](page-11-shot-02.png)

### Screenshot 24 — EXISTS: campaigns with indicators

Returns campaigns for which at least one linked indicator exists.

![Screenshot 24: EXISTS: campaigns with indicators](page-12-shot-01.png)

### Screenshot 25 — NOT EXISTS: assets without resolved alerts

Finds assets with no associated alert marked Resolved.

![Screenshot 25: NOT EXISTS: assets without resolved alerts](page-13-shot-01.png)

## Transactions and indexes

### Screenshot 26 — Savepoint and commit

Demonstrates a transaction with a savepoint, a rollback to that savepoint, and a final commit.

![Screenshot 26: Savepoint and commit](page-14-shot-01.png)

### Screenshot 27 — Full transaction rollback

Demonstrates rolling back a transaction so the change is discarded.

![Screenshot 27: Full transaction rollback](page-15-shot-01.png)

### Screenshot 28 — Database index listing

Shows the indexes present in the PostgreSQL database and the relations they support.

![Screenshot 28: Database index listing](page-16-shot-01.png)

## Final security analysis

### Screenshot 29 — High and critical security alerts

Filters alerts to high-severity and critical-severity records.

![Screenshot 29: High and critical security alerts](page-16-shot-02.png)

### Screenshot 30 — Strong campaign correlations

Returns campaigns above the selected correlation threshold, ordered by score.

![Screenshot 30: Strong campaign correlations](page-17-shot-01.png)

### Screenshot 31 — Final threat intelligence correlation query

Combines campaign, actor, indicator, malware, alert, and asset data for investigation.

![Screenshot 31: Final threat intelligence correlation query](page-17-shot-02.png)
