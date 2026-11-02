# Local dashboard

This browser UI reads the PostgreSQL schema through a small Node.js server. It uses only Node's built-in modules and the `psql` command-line client; no npm packages are required.

## Start in sample-preview mode

With Node.js 18 or later:

```sh
npm start
```

Open <http://127.0.0.1:3000>. If there is no database connection, the dashboard shows clearly labeled sample data. Status changes are disabled in this mode.

## Connect PostgreSQL

1. Create the database and load the SQL files in the order described in [`sql/00_setup.md`](../sql/00_setup.md).
2. From the repository root, copy `.env.example` to `.env` and set `DATABASE_URL` to your local database connection string.
3. Start the app again with `npm start`, then refresh the browser.

Example:

```sh
cp .env.example .env
# Edit DATABASE_URL in .env
npm start
```

The app binds to `127.0.0.1` by default. It should be treated as a local academic demo, not deployed as an internet-facing service. The dashboard can read alerts, campaigns, indicators, and assets; changing an alert status sends an update to PostgreSQL and the status-audit trigger records it.

## Pages

- **Overview:** alert counts by severity, strongest campaign links, and newest alerts.
- **Alerts:** search/filter alerts and update status when connected to PostgreSQL.
- **Campaigns:** actor, status, normalized correlation score, and linked-record counts.
- **Indicators:** IOC type, value, confidence, source, and campaign count.
- **Assets:** organization, host, criticality, and alert count.
