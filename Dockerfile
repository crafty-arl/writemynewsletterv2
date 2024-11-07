# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables from the .env.local file
ENV NEXT_PUBLIC_THIRDWEB_CLIENT_ID=${NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
ENV NEXT_PUBLIC_APPWRITE_API_KEY=${NEXT_PUBLIC_APPWRITE_API_KEY}
ENV NEXT_PUBLIC_APPWRITE_PROJECT_ID=${NEXT_PUBLIC_APPWRITE_PROJECT_ID}
ENV NEXT_PUBLIC_APPWRITE_DATABASE_ID=${NEXT_PUBLIC_APPWRITE_DATABASE_ID}
ENV NEXT_PUBLIC_APPWRITE_COLLECTION_ID=${NEXT_PUBLIC_APPWRITE_COLLECTION_ID}
ENV NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONTENT=${NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONTENT}
ENV NEXT_PUBLIC_APPWRITE_ENDPOINT=${NEXT_PUBLIC_APPWRITE_ENDPOINT}

# Build the Next.js application
RUN npm run build

# Expose the port on which the application will run (default for Next.js is 3000)
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "start"]