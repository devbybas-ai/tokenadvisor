import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// happy-dom does not auto-cleanup between tests
afterEach(() => {
  cleanup();
});
