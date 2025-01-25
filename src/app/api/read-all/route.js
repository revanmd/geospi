import { promises as fs } from "fs";
import path from "path";

export async function GET(request) {
  try {
    // Define the path to the JSON file
    const filePath = path.join(process.cwd(), "data", "calculated_areas.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const kdpkab = searchParams.get("KDPKAB");
    const kdcpum = searchParams.get("KDCPUM");

    // Filter the data based on query parameters
    const filteredData = data.filter((item) => {
      const matchesKDPKAB = kdpkab ? item.KDPKAB === kdpkab : true;
      const matchesKDCPUM = kdcpum ? item.KDCPUM === kdcpum : true;
      return matchesKDPKAB && matchesKDCPUM;
    });

    // Return the JSON response
    return new Response(JSON.stringify(filteredData), {
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
