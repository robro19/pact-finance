import { spawnSync } from "node:child_process";
import process from "node:process";

const command = process.platform === "win32" ? "opennextjs-cloudflare.cmd" : "opennextjs-cloudflare";
const result = spawnSync(command, ["build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    CI: "1",
    NEXT_TELEMETRY_DISABLED: "1",
  },
});

if (result.error) {
  console.error("[cloudflare-build] Unable to start OpenNext:", result.error.message);
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}