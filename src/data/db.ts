import { readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "../../data");

export async function readData<T>(filename: string): Promise<T[]> {
  try {
    const content = await readFile(join(dataDir, filename), "utf8");
    return JSON.parse(content) as T[];
  } catch (err) {
    // err trong catch luôn là 'unknown' — phải kiểm tra trước khi dùng
    if (
      err instanceof Error &&
      (err as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return [];
    }
    throw err;
  }
}

export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  await writeFile(join(dataDir, filename), JSON.stringify(data, null, 2));
}
