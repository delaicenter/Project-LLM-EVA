FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Start the app
CMD ["npx", "expo", "start", "--tunnel", "--dev-client"]
