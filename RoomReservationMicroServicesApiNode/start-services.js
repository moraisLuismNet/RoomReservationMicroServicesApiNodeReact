const concurrently = require("concurrently");
const { exec } = require("child_process");
const path = require("path");

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

const ports = [7007, 7008, 7009, 7010, 7011];

function cleanPorts() {
  return new Promise((resolve) => {
    console.log("🧹 Cleaning up ports...");
    const command = `powershell -Command "$ports = ${ports.join(
      ","
    )}; foreach ($port in $ports) { $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue; if ($connection) { Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host 'Killed process on port' $port } }"`;

    exec(command, (error, stdout, stderr) => {
      if (error && stderr) {
        // Ignore errors if no process found
        // console.error('Port cleanup warning:', stderr);
      }
      if (stdout.trim()) console.log(stdout.trim());
      resolve();
    });
  });
}

function openSwaggerDocs() {
  console.log("📄 Opening Swagger documentation...");
  const urls = [
    "http://localhost:7007/api-docs",
    "http://localhost:7008/api-docs",
    "http://localhost:7009/api-docs",
    "http://localhost:7010/api-docs",
    "http://localhost:7011/api-docs",
  ];

  // Open with a slight delay to ensure services are up
  setTimeout(async () => {
    for (const url of urls) {
      // Use 'start' for Windows
      exec(`start ${url}`);
      // Add small delay between opens to prevent browser ignoring commands
      await new Promise((r) => setTimeout(r, 1000));
    }
  }, 15000);
}

async function start() {
  await cleanPorts();

  console.log("🚀 Starting services...");

  const { result } = concurrently(
    [
      {
        command: "npm run dev",
        name: "USER",
        cwd: "UserAndAuthorizationManagementMicroService",
        prefixColor: "blue",
      },
      {
        command: "npm run dev",
        name: "ROOM",
        cwd: "RoomMicroService",
        prefixColor: "magenta",
      },
      {
        command: "npm run dev",
        name: "RSVP",
        cwd: "ReservationsMicroService",
        prefixColor: "yellow",
      },
      {
        command: "npm run dev",
        name: "PAY ",
        cwd: "PaymentMicroService",
        prefixColor: "green",
      },
      {
        command: "npm run dev",
        name: "MAIL",
        cwd: "SendingEmailsMicroService",
        prefixColor: "cyan",
      },
    ],
    {
      prefix: "name",
      killOthers: ["failure", "success"],
      restartTries: 3,
    }
  );

  // Open docs after start initiated
  openSwaggerDocs();

  result.then(
    () => console.log("All services stopped"),
    (err) => console.error("Error in services:", err)
  );
}

start();
