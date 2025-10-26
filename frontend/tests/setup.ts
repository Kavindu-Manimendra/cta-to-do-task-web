import "@testing-library/jest-dom";
import { vi } from "vitest";

(globalThis.fetch as any) = vi.fn();

