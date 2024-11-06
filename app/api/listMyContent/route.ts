import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Appwrite-Response-Format", "1.6.0");
  myHeaders.append("X-Appwrite-Project", "67297b09003bb97a1c86");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow" as RequestRedirect
  };

  try {
    const response = await fetch(`http://31.220.107.113:8081/v1/databases/users/collections/672ba0120006819e97fd/documents`, requestOptions);
    const result = await response.json();

    // Filter documents by wallet address and map to content_gen_value
    const filteredContentValues = result.documents
      .filter((doc: { wallet_addr: string | null }) => doc.wallet_addr === walletAddress)
      .map((doc: { content_gen_value: string }) => doc.content_gen_value);

    return NextResponse.json({ content_gen_values: filteredContentValues });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
