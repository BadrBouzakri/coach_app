# Manifests Kubernetes - Coach App

Manifests Kubernetes pour le déploiement de Coach App sur K3s.

## Structure

```
k8s/
├── namespace.yaml              # Namespace coach-app
├── secrets.yaml                # Secrets MongoDB et Backend (⚠️ à modifier!)
├── mongodb-pvc.yaml            # PersistentVolumeClaim 5GB
├── mongodb-deployment.yaml     # MongoDB + Service
├── backend-deployment.yaml     # Backend API + Service
├── frontend-deployment.yaml    # Frontend React + Service
└── ingress.yaml                # Ingress Traefik
```

## Ordre de Déploiement

```bash
# 1. Namespace
kubectl apply -f namespace.yaml

# 2. Secrets (ou créez-les manuellement)
kubectl apply -f secrets.yaml

# 3. MongoDB
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml

# 4. Backend
kubectl apply -f backend-deployment.yaml

# 5. Frontend
kubectl apply -f frontend-deployment.yaml

# 6. Ingress
kubectl apply -f ingress.yaml
```

## Déploiement Rapide

```bash
# Tout déployer en une commande
kubectl apply -f namespace.yaml && \
kubectl apply -f secrets.yaml && \
kubectl apply -f mongodb-pvc.yaml && \
kubectl apply -f mongodb-deployment.yaml && \
kubectl apply -f backend-deployment.yaml && \
kubectl apply -f frontend-deployment.yaml && \
kubectl apply -f ingress.yaml

# Ou utiliser le script
cd ..
./deploy.sh deploy
```

## Vérification

```bash
# Pods
kubectl get pods -n coach-app

# Services
kubectl get svc -n coach-app

# Ingress
kubectl get ingress -n coach-app

# Logs
kubectl logs -l app=backend -n coach-app
kubectl logs -l app=frontend -n coach-app
kubectl logs -l app=mongodb -n coach-app
```

## Configuration

### Secrets

⚠️ **IMPORTANT**: Modifiez `secrets.yaml` avant utilisation en production!

Ou créez les secrets manuellement:

```bash
kubectl create secret generic mongodb-secret \
  --from-literal=username=admin \
  --from-literal=password=VotreMotDePasse \
  -n coach-app

kubectl create secret generic backend-secret \
  --from-literal=jwt-secret=$(openssl rand -base64 32) \
  --from-literal=mongodb-uri=mongodb://admin:VotreMotDePasse@mongodb-service:27017/coach_app?authSource=admin \
  -n coach-app
```

### Resources

Les limites de ressources sont définies dans chaque deployment:

- **MongoDB**: 256Mi-512Mi RAM, 250m-500m CPU
- **Backend**: 256Mi-512Mi RAM, 250m-500m CPU
- **Frontend**: 128Mi-256Mi RAM, 100m-200m CPU

### Replicas

- **MongoDB**: 1 (StatefulSet recommandé pour production)
- **Backend**: 2
- **Frontend**: 2

## Accès

### Via Ingress

Ajouter à `/etc/hosts`:
```
127.0.0.1 coach-app.local
```

Puis: http://coach-app.local

### Via Port Forwarding

```bash
kubectl port-forward -n coach-app service/frontend-service 8080:80
kubectl port-forward -n coach-app service/backend-service 8081:5000
```

- Frontend: http://localhost:8080
- Backend: http://localhost:8081

## Documentation

Consultez [K3S_DEPLOYMENT.md](../K3S_DEPLOYMENT.md) pour le guide complet.
