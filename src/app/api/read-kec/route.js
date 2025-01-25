import { promises as fs } from "fs";
import path from "path";

export async function GET(request) {
    try {
        // Define the path to the JSON file
        const filePath = path.join(process.cwd(), "data", "calculated_areas_kec.json");
        const jsonData = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(jsonData);

        // Extract the query parameter from the URL
        const { searchParams } = new URL(request.url);
        const kdpkab = searchParams.get("KDPKAB");


        // Filter the data if the query parameter is provided
        const filteredData = kdpkab
            ? data.filter((item) => item.KDPKAB === kdpkab)
            : data;


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
