# Local two-database dashboard

This project uses PostgreSQL for normalized relational records and MongoDB for flexible threat-evidence documents. The dashboard reads operational tables from PostgreSQL and the **Intel evidence** page from MongoDB.

## Requirements

- Node.js 18 or later
- PostgreSQL 12 or later, with `psql` available on `PATH`
- MongoDB 6 or later

Install the MongoDB Node.js driver from the repository root:

```sh
npm install
```

## Configure and initialize

1. Copy `.env.example` to `.env` and set `DATABASE_URL` for your PostgreSQL database. Set `MONGODB_URI` and `MONGODB_DATABASE` for MongoDB.
2. Create the PostgreSQL database and load the SQL files in the order in [`sql/00_setup.md`](../sql/00_setup.md).
3. Start MongoDB. For a local demo, create a data directory and run `mongod` in its own Terminal window:

```sh
mkdir -p /tmp/threat-intel-mongodb
mongod --dbpath /tmp/threat-intel-mongodb --bind_ip 127.0.0.1 --port 27017
```

4. Seed the document collection from the repository root:

```sh
npm run seed:mongodb
```

The seed command can be rerun safely. It upserts the eight example documents into the `threat_evidence` collection in the configured MongoDB database.

## Start the dashboard

```sh
npm start
```

Open <http://127.0.0.1:3000>. The PostgreSQL pages show alerts, campaigns, indicators, and assets. **Intel evidence** shows MongoDB documents with flexible nested source context. The health indicator reports the status of both databases. Alert status changes update PostgreSQL, where the audit trigger records them.

The app binds to `127.0.0.1` by default. Treat it as a local academic demo; do not expose it directly to the internet. If a database is offline, its pages display a connection message while the other database's features remain available.

## Pages

- **Overview:** alert counts by severity, strongest campaign links, and newest alerts.
- **Alerts:** search/filter detections and update PostgreSQL-backed investigation status.
- **Campaigns:** actor, status, normalized correlation score, and linked-record counts from PostgreSQL.
- **Indicators:** IOC type, value, confidence, source, and campaign count from PostgreSQL.
- **Assets:** organization, host, criticality, and alert count from PostgreSQL.
- **Intel evidence:** source-specific nested documents and tags from MongoDB, linked to PostgreSQL indicators by ID.
