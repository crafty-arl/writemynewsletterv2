import { Client, Databases } from "appwrite";


const client = new Client()
    .setEndpoint("https://cloud.nocodecreative.xyz/v1")
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

const databases = new Databases(client);

export { databases };
