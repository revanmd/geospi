import { promises as fs } from "fs";
import path from "path";

export async function GET(request) {
  try {
    // Define the path to the JSON file
    const filePath = path.join(process.cwd(), "data", "areas.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const kdppum = searchParams.get("KDPPUM");
    const kdpkab = searchParams.get("KDPKAB");
    const kdcpum = searchParams.get("KDCPUM");

    let filteredData;

    if (kdcpum) {
      // Filter by KDCPUM and return unique KDEPUM
      filteredData = data
        .filter((item) => item.KDCPUM === kdcpum)
        .map((item) => item.KDEPUM);
    } else if (kdpkab) {
      // Filter by KDPKAB and return unique KDCPUM
      filteredData = data
        .filter((item) => item.KDPKAB === kdpkab)
        .map((item) => item.KDCPUM);
    } else if (kdppum) {
      // Filter by KDPPUM and return unique KDPKAB
      filteredData = data
        .filter((item) => item.KDPPUM === kdppum)
        .map((item) => item.KDPKAB);
    } else {
      // Return unique KDPPUM
      filteredData = data.map((item) => item.KDPPUM);
    }

    // Remove duplicates and prepare the response
    const uniqueData = [...new Set(filteredData)];
    const response = {
      total: uniqueData.length,
      data: uniqueData,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading the JSON file:", error);

    // Return an error response
    return new Response(
      JSON.stringify({ error: "Failed to process the request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
