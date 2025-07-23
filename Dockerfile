# Use Node.js image
FROM node:20

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Set enviornment variable 
ENV NODE_ENV=production

# Expose the app's port
EXPOSE 3000

# Run the app
CMD ["node", "index.js"]
