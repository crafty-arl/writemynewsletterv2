import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const walletAddressToCheck = url.searchParams.get('walletAddress');

  console.log('Wallet address to check:', walletAddressToCheck);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("X-Appwrite-Response-Format", "1.6.0");
  myHeaders.append("X-Appwrite-Project", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow" as RequestRedirect
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID}/documents/`, requestOptions);
    
    const result = await response.json();
    
    interface Document {
      wallet_addr: string;
    }
    
    const walletAddresses = result.documents.map((doc: Document) => doc.wallet_addr);

    console.log('Fetched wallet addresses:', walletAddresses);

    if (walletAddressToCheck) {
      const exists = walletAddresses.includes(walletAddressToCheck);
      console.log('Wallet address exists:', exists);
      
      const response = exists 
        ? NextResponse.json({ exists: true }) 
        : NextResponse.redirect(new URL('/signup', request.url));
      
      const cookieStore = await cookies();
      cookieStore.set('uuid', walletAddressToCheck);
      
      return response;
    }

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error:', error);
    
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}