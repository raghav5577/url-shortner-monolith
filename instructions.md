# URL Shortener Monolith Setup & Commands

This guide provides the exact commands needed to run your URL Shortener application locally using Docker, Node, PM2, and Nginx.

## Prerequisites
- Node.js installed
- Docker Desktop installed and running

## 1. Start Infrastructure (MongoDB & Redis)
Run these commands in your terminal to start your database and cache in Docker:
```powershell
# Start MongoDB on port 27017
docker run -d -p 27017:27017 --name mongo-url mongo:7.0

# Start Redis on port 6379
docker run -d -p 6379:6379 --name redis-url redis
```

## 2. Install Dependencies
Open your project folder in the terminal and run:
```powershell
npm install
```

## 3. Start Node Backend Instances
Your application is configured to run 5 instances (ports 8181-8185). We use PM2 and the `ecosystem.config.js` file to launch them properly:
```powershell
# Delete any old PM2 processes
npx pm2 delete all

# Start the 5 instances using the config file
npx pm2 start ecosystem.config.js
```
*(You can view their status with `npx pm2 list` and logs with `npx pm2 logs`)*

## 4. Start Nginx Load Balancer
Nginx routes traffic to your 5 instances. We run Nginx in Docker to resolve `host.docker.internal` automatically.
```powershell
docker run -d --name nginx-lb -p 8080:8080 -v ${PWD}\nginx.conf:/etc/nginx/nginx.conf:ro nginx
```

## 5. Test the Application
- **Health Check (Load Balancing)**: Visit `http://localhost:8080/health` in your browser. Refresh to see the port change between 8181 and 8185.
- **Shorten URL**:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:8080/api/url/shorten" -Method Post -ContentType "application/json" -Body '{"originalUrl":"https://www.google.com"}'
  ```
- **Test Redirect (and Cache)**: Visit `http://localhost:8080/api/url/1` in your browser. The first visit hits MongoDB and saves to Redis. The second visit hits the Redis cache instantly!

## 6. Cleanup (Shutdown)
When you are done testing, you can stop everything with:
```powershell
npx pm2 delete all
docker rm -f nginx-lb mongo-url redis-url
```


npx pm2 delete all
npx pm2 start ecosystem.config.js