# Build Docker Images (Docker Desktop K8s uses local images)
Write-Host "🏗️  Building Backend Image..." -ForegroundColor Cyan
docker build -t coach-app-backend:v3 ./backend

Write-Host "🏗️  Building Frontend Image..." -ForegroundColor Cyan
docker build -t coach-app-frontend:v7 ./frontend

# Apply Kubernetes Manifests
Write-Host "🚀 Deploying to Kubernetes..." -ForegroundColor Cyan
kubectl apply -f ./k3s/deployment.yaml

# Force Restart to pick up new images
Write-Host "🔄 Restarting Deployments..." -ForegroundColor Cyan
kubectl rollout restart deployment coach-app-backend -n coach-app
kubectl rollout restart deployment coach-app-frontend -n coach-app
kubectl rollout restart deployment coach-app-mongo -n coach-app

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "🌍 App should be available at http://localhost:30080" -ForegroundColor Green
