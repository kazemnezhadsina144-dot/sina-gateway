import { mkdir, writeFile } from "node:fs/promises";

await mkdir("data", { recursive: true });
await writeFile("data/leads.json", "[]\n");
console.log("Local test leads cleared from data/leads.json.");
