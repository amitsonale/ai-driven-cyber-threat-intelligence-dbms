# Running the PostgreSQL project

The scripts are ordered for a new, empty PostgreSQL database. The schema and sample data form a complete reconstructed implementation based on the supplied execution report, report text, and screenshots. They are not the unavailable original source files, and their illustrative seed values may not match every screenshot row exactly.

```sh
createdb threat_intel_db
psql -d threat_intel_db -f sql/01_schema.sql
psql -d threat_intel_db -f sql/02_seed_data.sql
psql -d threat_intel_db -f sql/03_views_indexes.sql
psql -d threat_intel_db -f sql/04_queries.sql
psql -d threat_intel_db -f sql/05_functions_procedures_triggers.sql
```

`sql/06_transaction_examples.sql` is a separate demonstration script. The commit example is safe to run; the final full-rollback block intentionally leaves no changes committed.

If `createdb` is unavailable, create a database named `threat_intel_db` with `CREATE DATABASE threat_intel_db;` in `psql`, reconnect to it, then run the scripts in order. The scripts require PostgreSQL 12 or later.
