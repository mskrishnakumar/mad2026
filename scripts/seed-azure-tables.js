/**
 * Azure Table Storage Seed Script
 *
 * This standalone script seeds Azure Table Storage with mock data.
 * Use this when migrating to a new Azure account.
 *
 * Prerequisites:
 *   npm install @azure/data-tables dotenv
 *
 * Usage:
 *   1. Copy .env.migration.template to .env.migration
 *   2. Fill in your Azure Storage connection string
 *   3. Run: node scripts/seed-azure-tables.js
 *
 * Options:
 *   --table=students    Seed only students table
 *   --table=programmes  Seed only programmes table
 *   --table=jobs        Seed only jobs table
 *   --table=centres     Seed only centres table
 *   --table=all         Seed all tables (default)
 *   --clear             Clear existing data before seeding
 */

require('dotenv').config({ path: '.env.migration' });

const { TableClient, TableServiceClient } = require('@azure/data-tables');
const fs = require('fs');
const path = require('path');

// Configuration
const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const TABLE_NAMES = {
  students: process.env.AZURE_TABLE_STUDENTS || 'students',
  programmes: process.env.AZURE_TABLE_PROGRAMMES || 'programmes',
  jobs: process.env.AZURE_TABLE_JOBS || 'jobs',
  centres: process.env.AZURE_TABLE_CENTRES || 'centres',
  counsellors: process.env.AZURE_TABLE_COUNSELLORS || 'counsellors',
};

// Parse command line arguments
const args = process.argv.slice(2);
const tableArg = args.find(a => a.startsWith('--table='));
const targetTable = tableArg ? tableArg.split('=')[1] : 'all';
const shouldClear = args.includes('--clear');

// Validate connection string
if (!CONNECTION_STRING) {
  console.error('Error: AZURE_STORAGE_CONNECTION_STRING not found in environment');
  console.error('Please copy .env.migration.template to .env.migration and configure it');
  process.exit(1);
}

// Load seed data
const seedDataDir = path.join(__dirname, 'seed-data');

function loadSeedData(filename) {
  const filepath = path.join(seedDataDir, filename);
  if (!fs.existsSync(filepath)) {
    console.error(`Seed data file not found: ${filepath}`);
    console.error('Run "node scripts/generate-seed-data.js" first to generate seed data');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

// Create table if not exists
async function ensureTable(tableName) {
  const serviceClient = TableServiceClient.fromConnectionString(CONNECTION_STRING);
  try {
    await serviceClient.createTable(tableName);
    console.log(`  Created table: ${tableName}`);
  } catch (error) {
    if (error.statusCode !== 409) {
      // 409 = table already exists, which is fine
      throw error;
    }
    console.log(`  Table exists: ${tableName}`);
  }
}

// Clear table data
async function clearTable(tableName) {
  const client = TableClient.fromConnectionString(CONNECTION_STRING, tableName);
  console.log(`  Clearing table: ${tableName}`);

  let count = 0;
  const entities = client.listEntities();
  for await (const entity of entities) {
    await client.deleteEntity(entity.partitionKey, entity.rowKey);
    count++;
  }
  console.log(`  Deleted ${count} entities from ${tableName}`);
}

// Seed a table with data
async function seedTable(tableName, data, partitionKeyField = 'id') {
  const client = TableClient.fromConnectionString(CONNECTION_STRING, tableName);

  let success = 0;
  let errors = 0;

  for (const item of data) {
    try {
      const entity = {
        partitionKey: String(item[partitionKeyField] || 'default'),
        rowKey: String(item.id || item[partitionKeyField]),
        ...Object.fromEntries(
          Object.entries(item).map(([k, v]) => [
            k,
            typeof v === 'object' ? JSON.stringify(v) : v
          ])
        )
      };

      await client.upsertEntity(entity, 'Replace');
      success++;
    } catch (error) {
      console.error(`  Error inserting ${item.id}: ${error.message}`);
      errors++;
    }
  }

  return { success, errors };
}

// Main execution
async function main() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Azure Table Storage Migration Script     ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log(`Target: ${targetTable}`);
  console.log(`Clear existing: ${shouldClear}\n`);

  const results = {};

  // Students
  if (targetTable === 'all' || targetTable === 'students') {
    console.log('\n📚 Processing Students...');
    await ensureTable(TABLE_NAMES.students);
    if (shouldClear) await clearTable(TABLE_NAMES.students);
    const students = loadSeedData('students.json');
    results.students = await seedTable(TABLE_NAMES.students, students);
    console.log(`  ✓ Students: ${results.students.success} seeded, ${results.students.errors} errors`);
  }

  // Programmes
  if (targetTable === 'all' || targetTable === 'programmes') {
    console.log('\n📖 Processing Programmes...');
    await ensureTable(TABLE_NAMES.programmes);
    if (shouldClear) await clearTable(TABLE_NAMES.programmes);
    const programmes = loadSeedData('programmes.json');
    results.programmes = await seedTable(TABLE_NAMES.programmes, programmes);
    console.log(`  ✓ Programmes: ${results.programmes.success} seeded, ${results.programmes.errors} errors`);
  }

  // Jobs
  if (targetTable === 'all' || targetTable === 'jobs') {
    console.log('\n💼 Processing Jobs...');
    await ensureTable(TABLE_NAMES.jobs);
    if (shouldClear) await clearTable(TABLE_NAMES.jobs);
    const jobs = loadSeedData('jobs.json');
    results.jobs = await seedTable(TABLE_NAMES.jobs, jobs);
    console.log(`  ✓ Jobs: ${results.jobs.success} seeded, ${results.jobs.errors} errors`);
  }

  // Centres
  if (targetTable === 'all' || targetTable === 'centres') {
    console.log('\n🏢 Processing Centres...');
    await ensureTable(TABLE_NAMES.centres);
    if (shouldClear) await clearTable(TABLE_NAMES.centres);
    const centresData = loadSeedData('centres.json');
    results.centres = await seedTable(TABLE_NAMES.centres, centresData.centres);
    console.log(`  ✓ Centres: ${results.centres.success} seeded, ${results.centres.errors} errors`);
  }

  // Counsellors
  if (targetTable === 'all' || targetTable === 'counsellors') {
    console.log('\n👩‍🏫 Processing Counsellors...');
    await ensureTable(TABLE_NAMES.counsellors);
    if (shouldClear) await clearTable(TABLE_NAMES.counsellors);
    const counsellors = loadSeedData('counsellors.json');
    results.counsellors = await seedTable(TABLE_NAMES.counsellors, counsellors);
    console.log(`  ✓ Counsellors: ${results.counsellors.success} seeded, ${results.counsellors.errors} errors`);
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║              Migration Summary             ║');
  console.log('╚════════════════════════════════════════════╝\n');

  for (const [table, result] of Object.entries(results)) {
    console.log(`  ${table}: ${result.success} records seeded, ${result.errors} errors`);
  }

  const totalSuccess = Object.values(results).reduce((s, r) => s + r.success, 0);
  const totalErrors = Object.values(results).reduce((s, r) => s + r.errors, 0);

  console.log(`\n  Total: ${totalSuccess} records seeded, ${totalErrors} errors`);
  console.log('\n✓ Migration complete!\n');
}

main().catch(error => {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
});
