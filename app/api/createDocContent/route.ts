import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log("Received request to create document");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Appwrite-Response-Format", "1.6.0");
    myHeaders.append("X-Appwrite-Project", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

    // Parse the request body to get the variables passed in the API call
    const { documentId, data, permissions } = await request.json();

    console.log("Parsed request body:", { documentId, data, permissions });

    // Create the raw JSON payload using the variables from the request body
    const raw = JSON.stringify({
        documentId,
        data,
        permissions
    });

    console.log("Raw JSON payload:", raw);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        console.log("Sending request to Appwrite API");

        const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONTENT}/documents`, requestOptions as RequestInit);
        
        console.log("Received response from Appwrite API");

        const result = await response.json();

        console.log("Response JSON:", result);

        return NextResponse.json(result);
    } catch (error) {   
        console.error("Error occurred:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}

// Example of how to call this API with variables:
// fetch('/api/createDoc', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         documentId: 'yourDocId',
//         data: {
//             uuid: 'yourUUID',
//             wallet_addr: 'yourWalletAddress',
//             account_created: 'yourAccountCreatedDate',
//             username: 'yourUsername'
//         },
//         permissions: [
//             'read("any")'
//         ]
//     }),
// })
