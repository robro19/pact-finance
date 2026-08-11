import { existsSync, writeFileSync } from "node:fs";

const configPath = "open-next.config.ts";

if (!existsSync(configPath)) {
  writeFileSync(
    configPath,
    `import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
`,
    "utf8",
  );
  console.log(`[open-next] Created ${configPath}`);
} else {
  console.log(`[open-next] Using existing ${configPath}`);
}