import { describe, expect, it } from "vitest";
import { generateOutputObject } from "./config-object.js";

const DEFAULT_OUTPUT = {
  name: "app-created",
};

describe("Run CLI", () => {
  it("Output object matches shape", () => {
    const output = generateOutputObject();
    expect(output).toEqual(DEFAULT_OUTPUT);
  });
});
