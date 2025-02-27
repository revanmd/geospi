import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
export async function POST(req) {
    try {
        // Parse JSON body from request
        const { username, password } = await req.json();

        const listUsername = [
            '1120084',  //yetty
            '4244758',  //yetty
            '1200077',  //aldy
            '1200093',  //maria
            '1160031',  //gita
            '91010196', //revan
            '1210035',  //handono
            'guest'
        ]

        if (!listUsername.includes(username)) {
            return NextResponse.json({ error: "Username is not authorized" }, { status: 400 });
        } 

        if(username == 'guest' && password == 'guest@geospasial'){
            return NextResponse.json({message:'Authorized guest'}, { status: 200 });
        }

        

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        // Create FormData object
        const form = new FormData();
        form.append("username", username);
        form.append("password", password);

        // Make request to external API
        const response = await axios.post(
            "https://api-pismart.pupuk-indonesia.com/oauth_api/user/login",
            form,
            {
                headers: form.getHeaders(), // Automatically sets headers for FormData
            }
        );

        return NextResponse.json(response.data, { status: response.status });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
