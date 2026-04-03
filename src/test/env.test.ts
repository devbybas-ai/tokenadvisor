import { describe, it, expect } from "vitest";

describe("Environment", () => {
  it("should have test environment set", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});

describe("Project structure", () => {
  it("should have a working test setup", () => {
    expect(true).toBe(true);
  });
});
