import { promises as fs } from "fs";
import path from "path";

export async function GET(request) {
  try {
    // Define the path to the JSON file
    const filePath = path.join(process.cwd(), "data", "calculated_umur_kab.json");

    // Read the JSON file
    const jsonData = await fs.readFile(filePath, "utf-8");

    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Return the JSON response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading the JSON file:", error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: "Failed to read the JSON file" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
