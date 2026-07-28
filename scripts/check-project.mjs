import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const html = await readFile("index.html", "utf8");
const required = ["lang=\"ja\"", "name=\"description\"", "id=\"maker\"", "aria-live=\"polite\""];

for (const marker of required) {
  if (!html.includes(marker)) throw new Error(`index.html is missing: ${marker}`);
}

const localReferences = [...html.matchAll(/(?:src|href)="\.\/(?!#)([^"?#]+)"/g)].map((match) => match[1]);
for (const path of new Set(localReferences)) {
  await access(path, constants.R_OK);
}

if (/#[dD][dD][cC][cC][bB][bB]|beige/i.test(await readFile("style.css", "utf8"))) {
  throw new Error("The beige escape hatch has reopened.");
}

console.log(`Project check passed: ${new Set(localReferences).size} local assets verified.`);
