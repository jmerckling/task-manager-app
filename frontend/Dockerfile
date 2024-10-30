# Use the latest LTS version of Node.js (compatible with Next.js)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port used by the Next.js server
EXPOSE 3000

# Start the Next.js development server
CMD ["npm", "run", "dev"]
