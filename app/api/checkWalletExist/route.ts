import { NextResponse } from 'next/server';

export async function GET() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Appwrite-Response-Format", "1.6.0");
  myHeaders.append("X-Appwrite-Project", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}/documents/`, requestOptions as RequestInit);
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
