import { describe, expect, it } from "vitest";
import path from "node:path";
import { canCreateFile, createFile, deleteFile } from "./create-file.js";

const FIXTURES_PATH = path.resolve(__dirname, "..", "..", "fixtures");

describe("check if file exists", () => {
  it("returns `false` if file exists and is not empty ", async () => {
    const output = await canCreateFile(FIXTURES_PATH + "/text.txt");
    expect(output).toEqual(false);
  });

  it("returns `true` if file does not exists", async () => {
    const output = await canCreateFile(FIXTURES_PATH + "/404.txt");
    expect(output).toEqual(true);
  });

  it("returns `true` if file exists but is empty", async () => {
    const output = await canCreateFile(FIXTURES_PATH + "/empty.txt");
    expect(output).toEqual(true);
  });
});

describe("create a file", () => {
  it("creates a JSON file", async () => {
    const createdFile = await createFile(
      FIXTURES_PATH + "/test-gen/hello.json",
      JSON.stringify({ hello: "world" }, null, 2)
    );

    expect(createdFile).toEqual(true);
    deleteFile(FIXTURES_PATH + "/test-gen/hello.json");
  });
});

describe("create a file", () => {
  it("creates a JSON file", async () => {
    await createFile(
      FIXTURES_PATH + "/test-gen/bye.json",
      JSON.stringify({ bye: "world" }, null, 2)
    );

    const deletedFile = await deleteFile(FIXTURES_PATH + "/test-gen/bye.json");
    expect(deletedFile).toEqual(true);
  });
});
