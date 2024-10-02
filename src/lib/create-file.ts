import fs from "node:fs/promises";

export async function canCreateFile(file: string) {
  try {
    const fileContent = await fs.readFile(file, "utf-8");

    if (fileContent.length > 0) {
      // "file exist and is not empty"
      return false;
    } else {
      return true;
    }
  } catch (e) {
    return true;
  }
}

export async function deleteFile(file: string) {
  try {
    await fs.rm(file);
    return true;
  } catch (e) {
    return "file can't be deleted";
  }
}

export async function createFile(filePath: string, fileContent: string) {
  try {
    const shouldCreate = await canCreateFile(filePath);

    if (!shouldCreate) {
      throw new Error(`${filePath} exists and is not empty`);
    } else {
      await fs.writeFile(filePath, fileContent, "utf8");
      return true;
    }
  } catch (e) {
    console.log("error", e);
    return e;
  }
}
