# AI-Driven Cyber Threat Intelligence & Attack Campaign Correlation System

**DBMS mini project — PostgreSQL**

A relational database project for connecting threat actors, campaigns, indicators of compromise (IOCs), malware, vulnerabilities, organizational assets, alerts, analysts, and reports.

## Authors

- Amit — PES2UG24CS624
- M. Sangamesh Prasad — PES2UG24CS640

## Repository contents

```text
.
├── docs/
│   └── project-report.docx
├── evidence/
│   ├── screenshots/       # 31 terminal screenshots, retained from the supplied PDF
│   └── source/            # Original SQL execution report PDF
└── sql/
    ├── 00_setup.md
    ├── 01_schema.sql
    ├── 02_seed_data.sql
    ├── 03_views_indexes.sql
    ├── 04_queries.sql
    ├── 05_functions_procedures_triggers.sql
    ├── 06_transaction_examples.sql
    └── recovered-examples.sql
```

## Included SQL

The ordered scripts provide a full reconstructed PostgreSQL implementation: relational schema and constraints, sample inserts, junction-table relations, joins, updates, aggregates, subqueries, `CASE`, a campaign summary view, `EXISTS`/`NOT EXISTS`, indexes, transaction and savepoint examples, a SQL function, a stored procedure, and audit/update triggers. Setup steps and run order are in [`sql/00_setup.md`](sql/00_setup.md).

The supplied source files contained an execution report with screenshots, but not the original complete `.sql` files. The implementation in `sql/` was therefore reconstructed from the project report and visible evidence; it is an integrated runnable version, not a byte-for-byte copy of the unavailable original. Some seed values are illustrative. The report records what was shown in the supplied evidence; routines and triggers are repository additions beyond that evidence.

## Evidence

All 31 terminal screenshots are retained under `evidence/screenshots/`, with a figure index in `evidence/screenshots/README.csv`. The original execution report is preserved in `evidence/source/`.
