# Docker Deployment Guide

This guide explains how to build and deploy the ExtraHand Next.js web application using Docker.

## Prerequisites

- Docker installed on your machine
- AWS CLI configured (for ECS deployment)
- AWS ECR repository created
- AWS ECS cluster and service configured

## Building the Docker Image

### Local Build

```bash
# Build the image
docker build -t extrahand-web-app-nextjs:latest .

# Run the container locally
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://extrahandbackend.llp.trizenventures.com \
  extrahand-web-app-nextjs:latest
```

### Build for Production

```bash
# Build with production optimizations
docker build -t extrahand-web-app-nextjs:latest \
  --build-arg NODE_ENV=production \
  .
```

## Pushing to AWS ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region <AWS_REGION> | \
  docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com

# Tag the image
docker tag extrahand-web-app-nextjs:latest \
  <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/extrahand-web-app-nextjs:latest

# Push to ECR
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/extrahand-web-app-nextjs:latest
```

## Environment Variables

The application requires the following environment variables:

### Required
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (optional)

### Optional
- `NODE_ENV` - Node environment (default: production)
- `PORT` - Server port (default: 3000)
- `HOSTNAME` - Server hostname (default: 0.0.0.0)

## AWS ECS Deployment

### 1. Update Container Definition

Edit `container-definition.json` and replace:
- `<ECR_REPOSITORY_URI>` - Your ECR repository URI
- `<TAG>` - Image tag (e.g., `latest` or version number)
- `<SECRETS_MANAGER_ARN>` - AWS Secrets Manager ARN for secrets
- `<AWS_REGION>` - Your AWS region

### 2. Create/Update ECS Task Definition

```bash
# Register new task definition
aws ecs register-task-definition \
  --family extrahand-web-app-nextjs \
  --requires-compatibilities FARGATE \
  --network-mode awsvpc \
  --cpu 256 \
  --memory 512 \
  --container-definitions file://container-definition.json
```

### 3. Update ECS Service

```bash
# Update service with new task definition
aws ecs update-service \
  --cluster <CLUSTER_NAME> \
  --service extrahand-web-app-nextjs \
  --task-definition extrahand-web-app-nextjs:<REVISION> \
  --force-new-deployment
```

## Health Check

The container includes a health check that verifies the application is responding. The health check:
- Runs every 30 seconds
- Has a 5-second timeout
- Retries 3 times before marking unhealthy
- Starts after 60 seconds (start period)

**Note**: You may need to create a health check endpoint at `/api/health` in your Next.js app, or update the health check command in `container-definition.json`.

## Secrets Management

For production, use AWS Secrets Manager to store sensitive environment variables:

1. Create secrets in AWS Secrets Manager
2. Update the `container-definition.json` with the correct ARNs
3. Ensure your ECS task execution role has permissions to read from Secrets Manager

## Troubleshooting

### Container fails to start
- Check CloudWatch logs: `/ecs/extrahand-web-app-nextjs`
- Verify environment variables are set correctly
- Check that the port 3000 is accessible

### Build fails
- Ensure `next.config.ts` has `output: 'standalone'` enabled
- Check that all dependencies are listed in `package.json`
- Verify Node.js version matches (20.x)

### Health check fails
- Create a health check endpoint or update the health check command
- Verify the application is listening on port 3000
- Check container logs for errors

## Multi-stage Build Benefits

The Dockerfile uses a multi-stage build to:
1. **Reduce image size** - Only production dependencies and built files are included
2. **Improve security** - Non-root user runs the application
3. **Optimize caching** - Dependencies are cached separately from source code
4. **Faster builds** - Only rebuild what changed

## Image Size Optimization

The final image is optimized by:
- Using Alpine Linux base image
- Only including necessary files from `.next/standalone`
- Running as non-root user
- Disabling Next.js telemetry
