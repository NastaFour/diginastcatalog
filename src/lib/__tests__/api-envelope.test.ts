import { describe, it, expect } from "vitest";
import { apiSuccess, apiError } from "../api-envelope";

describe("API Envelope Utilities", () => {
  it("creates a standardized success response", async () => {
    const data = { id: "test-123", name: "Gaming Setup" };
    const response = apiSuccess(data, 200);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data).toEqual(data);
    expect(json.timestamp).toBeDefined();
  });

  it("creates a standardized error response", async () => {
    const response = apiError("Invalid credentials", "UNAUTHORIZED", 401);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid credentials");
    expect(json.code).toBe("UNAUTHORIZED");
    expect(json.timestamp).toBeDefined();
  });
});
