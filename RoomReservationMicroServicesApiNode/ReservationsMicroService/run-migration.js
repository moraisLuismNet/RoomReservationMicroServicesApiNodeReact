require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  // Use exact same connection as TypeORM
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "reservations-db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  });

  try {
    console.log("🔌 Connecting to database...");
    console.log(`   Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`   Database: ${process.env.DB_NAME || "reservations-db"}`);
    console.log(`   User: ${process.env.DB_USER || "postgres"}`);

    await client.connect();
    console.log("✅ Connected to database");

    // Read the migration SQL file
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "change-userId-to-userEmail.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Executing ${statements.length} migration statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(
          `\n[${i + 1}/${statements.length}] Executing: ${statement.substring(
            0,
            60
          )}...`
        );
        await client.query(statement);
        console.log("✅ Success");
      }
    }

    console.log("\n🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

runMigration();
