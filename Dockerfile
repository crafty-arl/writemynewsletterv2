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

# Set environment variables directly in the Dockerfile
ENV NEXT_PUBLIC_THIRDWEB_CLIENT_ID=737300dcbd52599ef8785ab5d78a1254
ENV NEXT_PUBLIC_APPWRITE_API_KEY=standard_d337ef1e09ed86c8ed068c50bb89d0119115845d6bf129047af2aff31bea79b97639f0b3a6f25ac9d2deebb4c65400d364faa47f2604e50573e04dfaccf72577065f54ab4e8f4439db876332cdc78d336042b6264d9bbf139f57bdd3750ecc74ff8a6e7ae9fc69e2ddbb166ece7769e90345c79cbbff3958ac36b26e82543992
ENV NEXT_PUBLIC_APPWRITE_PROJECT_ID=67297b09003bb97a1c86
ENV NEXT_PUBLIC_APPWRITE_DATABASE_ID=users
ENV NEXT_PUBLIC_APPWRITE_COLLECTION_ID=67297be70013f4a3d89e
ENV NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONTENT=672ba0120006819e97fd
ENV NEXT_PUBLIC_APPWRITE_ENDPOINT=http://31.220.107.113:8081/v1

# Build the Next.js application
RUN npm run build

# Expose the port on which the application will run (default for Next.js is 3000)
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "start"]