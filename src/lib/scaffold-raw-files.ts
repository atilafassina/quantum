import fs from "node:fs/promises";
import path from "node:path";

export async function scaffoldRawFiles(source: string, destination: string) {
  try {
    // Check if source exists
    await fs.access(source);

    // Create destination directory if it doesn't exist
    await fs.mkdir(destination, { recursive: true });

    // Read the contents of the source directory
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        // Recursively copy subdirectories
        await scaffoldRawFiles(srcPath, destPath);
      } else {
        // Copy files
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory: ${String(error)}`);
    throw error;
  }
}
