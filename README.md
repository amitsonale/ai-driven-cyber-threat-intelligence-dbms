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
├── sql/
│   ├── README.md
│   └── recovered-examples.sql
└── src/                   # Reserved for the original implementation source
```

## Database concepts shown in the supplied execution evidence

The PostgreSQL evidence covers core entity data, joins, `UPDATE`, grouped aggregates, subqueries, `CASE`, a view, `EXISTS`/`NOT EXISTS`, indexes, and transaction control with savepoints, rollback, and commit. The screenshots are organized by source PDF page and screenshot order; the original PDF is preserved in `evidence/source/`.

## Source-code status

The supplied material contains an execution report with terminal screenshots, not the complete original `.sql` source or application code. `sql/recovered-examples.sql` contains only the statements that can be recovered from the written report; it is not a complete reproduction of the implementation. The `src/` directory is intentionally empty until the original project files are added. Do not treat missing schema, seed data, or query files as reconstructed original code.

## Setup

PostgreSQL is required. The full database cannot yet be initialized from this repository because the original schema and seed scripts were not included in the supplied files. Add the original project `.sql` files to `sql/` before using this as a runnable project.
