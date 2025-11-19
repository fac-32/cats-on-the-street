import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Swagger/OpenAPI Definition", () => {
  it("should be a valid OpenAPI 3.0.3 specification", () => {
    const swaggerJsonPath = path.resolve(__dirname, "./swagger.json");
    const swaggerJsonContent = fs.readFileSync(swaggerJsonPath, "utf-8");
    const swaggerDef = JSON.parse(swaggerJsonContent);

    // Check for OpenAPI version
    expect(swaggerDef.openapi).toBe("3.0.3");

    // Check for info block
    expect(swaggerDef.info).toBeDefined();
    expect(swaggerDef.info.title).toBe("Cats on the Street API");
    expect(swaggerDef.info.version).toBe("1.0.0");
    expect(swaggerDef.info.description).toBeDefined();

    // Check for paths
    expect(swaggerDef.paths).toBeDefined();
    expect(Object.keys(swaggerDef.paths).length).toBeGreaterThan(0);
  });
});
