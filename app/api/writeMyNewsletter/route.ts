import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log("Received request to write newsletter");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Parse the request body to get the variables passed in the API call
    const { wallet_address, prompt, docID } = await request.json();

    // Create the raw JSON payload using the variables from the request body
    const raw = JSON.stringify({
        wallet_address,
        prompt,
        docID
    });

    const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
    };

    try {
        console.log("Sending request to external webhook");

        // Simulate progress bar for 30 to 60 seconds
        const progressDuration = Math.floor(Math.random() * (60 - 30 + 1) + 30) * 1000;
        const progressInterval = 100; // Update progress every 100ms
        let progressValue = 0;

        const progressBar = setInterval(() => {
            progressValue += (100 / (progressDuration / progressInterval));
            if (progressValue >= 100) {
                clearInterval(progressBar);
                console.log("Your generation is finished, please check out the library.");
            }
        }, progressInterval);

        const response = await fetch("http://api.craftthefuture.xyz/webhook/prompt", requestOptions);
        
        console.log("Received response from external webhook");

        const result = await response.text();

        console.log("Response text:", result);

        return NextResponse.json({ result });
    } catch (error) {   
        console.error("Error occurred:", error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
}
