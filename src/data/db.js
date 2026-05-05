import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../../data");

export async function readData(filename) {
  try {
    const content = await readFile(join(dataDir, filename), "utf8");
    return JSON.parse(content);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function writeData(filename, data) {
  await writeFile(join(dataDir, filename), JSON.stringify(data, null, 2));
}
