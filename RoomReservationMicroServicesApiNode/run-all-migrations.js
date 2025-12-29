#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Fix for "spawn cmd.exe ENOENT" on Windows
if (process.platform === "win32") {
  const system32 = path.join(
    process.env.SystemRoot || "C:\\Windows",
    "System32"
  );
  if (!process.env.PATH.includes(system32)) {
    process.env.PATH = `${process.env.PATH}${path.delimiter}${system32}`;
  }
}

const microservices = [
  "UserAndAuthorizationManagementMicroService",
  "PaymentMicroService",
  "ReservationsMicroService",
  "RoomMicroService",
  "SendingEmailsMicroService",
];

async function runMigrationForService(serviceName) {
  return new Promise((resolve, reject) => {
    const command = `cd ${serviceName} && npm run migration:run`;

    console.log(`\n🚀 Running migrations in ${serviceName}...`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error in ${serviceName}:`, error.message);
        reject(error);
      } else {
        console.log(`✅ ${serviceName}: ${stdout.trim()}`);
        resolve(stdout);
      }
    });
  });
}

async function runAllMigrations() {
  console.log("🔄 Starting migrations in all microservices...\n");

  const results = [];

  for (const service of microservices) {
    // Verify if the microservice exists
    if (fs.existsSync(service)) {
      try {
        await runMigrationForService(service);
        results.push({ service, status: "success" });
      } catch (error) {
        results.push({ service, status: "error", error: error.message });
      }
    } else {
      console.log(`⚠️  ${service} not found, skipping...`);
      results.push({ service, status: "skipped" });
    }
  }

  console.log("\n📊 MIGRATION SUMMARY:");
  console.log("=".repeat(50));

  results.forEach((result) => {
    const icon =
      result.status === "success"
        ? "✅"
        : result.status === "error"
        ? "❌"
        : "⚠️";
    const status =
      result.status === "success"
        ? "COMPLETED"
        : result.status === "error"
        ? "ERROR"
        : "SKIPPED";
    console.log(`${icon} ${result.service}: ${status}`);

    if (result.status === "error" && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  console.log("\n📈 STATISTICS:");
  console.log(`✅ Completed: ${successCount}`);
  console.log(`❌ With errors: ${errorCount}`);
  console.log(`⚠️  Skipped: ${results.length - successCount - errorCount}`);

  if (errorCount > 0) {
    console.log(
      "\n⚠️  Some migrations failed. Please check the errors above."
    );
    process.exit(1);
  } else {
    console.log("\n🎉 All migrations completed successfully!");
  }
}

async function revertAllMigrations() {
  console.log("🔄 Reverting migrations in all microservices...\n");

  for (const service of microservices) {
    if (fs.existsSync(service)) {
      try {
        const command = `cd ${service} && npm run migration:revert`;
        await new Promise((resolve, reject) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Error reverting ${service}:`, error.message);
              reject(error);
            } else {
              console.log(`✅ ${service} reverted: ${stdout.trim()}`);
              resolve(stdout);
            }
          });
        });
      } catch (error) {
        console.error(`❌ Error reverting ${service}:`, error.message);
      }
    }
  }

  console.log("\n🎉 Reversion process completed!");
}

// Command line argument handling
const args = process.argv.slice(2);
const action = args[0];

if (action === "revert") {
  revertAllMigrations().catch(console.error);
} else if (action === "run" || !action) {
  runAllMigrations().catch(console.error);
} else {
  console.log("Usage: node run-all-migrations.js [run|revert]");
  console.log(
    "  run   - Run migrations in all microservices (default)"
  );
  console.log("  revert - Revert migrations in all microservices");
  console.log("\nMicroservices included:");
  microservices.forEach((service) => console.log(`  - ${service}`));
}
