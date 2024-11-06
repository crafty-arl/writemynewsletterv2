import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  console.error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not defined");
} else {
  console.log("NEXT_PUBLIC_THIRDWEB_CLIENT_ID:", clientId);
}

export const client = createThirdwebClient({
  clientId: clientId as string,
});
