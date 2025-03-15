#!/bin/bash

# Author-Ally Deployment Script

echo "Starting Author-Ally deployment..."

# Build the Docker image
echo "Building Docker image..."
docker build -t author-ally .

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
else
  echo "Error building Docker image. Exiting."
  exit 1
fi

# Run the container
echo "Running the container..."
docker run -d -p 80:80 --name author-ally-app author-ally

# Check if the container is running
if [ $? -eq 0 ]; then
  echo "Container started successfully."
  echo "Author-Ally is now running at http://localhost"
else
  echo "Error starting container. Exiting."
  exit 1
fi

echo "Deployment completed successfully!" 