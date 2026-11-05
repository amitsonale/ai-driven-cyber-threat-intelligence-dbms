'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { MongoClient } = require('mongodb');

function loadEnvFile() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith('#') || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

async function main() {
  loadEnvFile();
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DATABASE || 'threat_intel_evidence';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const documents = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'mongodb', 'seed-documents.json'), 'utf8'));
    const collection = client.db(dbName).collection('threat_evidence');
    for (const document of documents) {
      const { _id, ...fields } = document;
      await collection.replaceOne({ _id }, { _id, ...fields }, { upsert: true });
    }
    console.log(`Seeded ${documents.length} MongoDB threat-evidence documents in ${dbName}.`);
  } finally {
    await client.close();
  }
}

main().catch(error => {
  console.error(`MongoDB seed failed: ${error.message}`);
  process.exitCode = 1;
});
