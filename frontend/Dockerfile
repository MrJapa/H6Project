# frontend/Dockerfile
FROM node:19

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port for the React development server
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
