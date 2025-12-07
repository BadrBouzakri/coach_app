# Guide de Déploiement K3s - Coach App Wattrelos FC U12

Guide complet pour déployer l'application Coach App sur un cluster K3s local.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Installation K3s](#installation-k3s)
3. [Configuration](#configuration)
4. [Déploiement Rapide](#déploiement-rapide)
5. [Déploiement Manuel](#déploiement-manuel)
6. [Vérification](#vérification)
7. [Accès à l'Application](#accès-à-lapplication)
8. [Maintenance](#maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Architecture](#architecture)

---

## Prérequis

### Logiciels Requis

- **Docker Desktop** (Windows/Mac) ou **Docker Engine** (Linux)
- **kubectl** - Client Kubernetes
- **K3s** (Linux) ou **Kubernetes dans Docker Desktop** (Windows/Mac)
- **Git** - Pour cloner le repository
- Au minimum **4 GB RAM** et **10 GB** d'espace disque

### Vérification des Prérequis

```bash
# Vérifier Docker
docker --version

# Vérifier kubectl
kubectl version --client

# Vérifier K3s (Linux)
k3s --version
```

---

## Installation K3s

### Linux

```bash
# Installation K3s
curl -sfL https://get.k3s.io | sh -

# Configurer kubectl pour l'utilisateur actuel
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config

# Vérifier l'installation
kubectl get nodes
```

### Windows/Mac (avec Docker Desktop)

1. Installer Docker Desktop
2. Activer Kubernetes dans les paramètres Docker Desktop
3. kubectl sera automatiquement configuré

Ou utiliser **K3d** (K3s dans Docker):

```bash
# Installer K3d
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Créer un cluster
k3d cluster create coach-app-cluster
```

---

## Configuration

### 1. Cloner le Repository

```bash
git clone <repository-url>
cd coach_app
```

### 2. Configurer les Secrets

**IMPORTANT**: Ne jamais utiliser les secrets par défaut en production!

#### Option A: Créer les secrets manuellement (Recommandé)

```bash
# Secret MongoDB
kubectl create secret generic mongodb-secret \
  --from-literal=username=admin \
  --from-literal=password=VotreMotDePasseSecurise123! \
  -n coach-app

# Secret Backend
kubectl create secret generic backend-secret \
  --from-literal=jwt-secret=$(openssl rand -base64 32) \
  --from-literal=mongodb-uri=mongodb://admin:VotreMotDePasseSecurise123!@mongodb-service:27017/coach_app?authSource=admin \
  -n coach-app
```

#### Option B: Utiliser le fichier secrets.yaml (Dev uniquement)

Le fichier `k8s/secrets.yaml` contient des valeurs par défaut. Modifiez-les avant utilisation:

```bash
# Encoder vos secrets en base64
echo -n "votre-password" | base64
echo -n "votre-jwt-secret" | base64

# Éditer k8s/secrets.yaml avec vos valeurs
# Puis appliquer
kubectl apply -f k8s/secrets.yaml
```

### 3. Générer les Icônes PWA

Avant de construire le frontend, générez les icônes:

```bash
cd frontend/public

# Depuis icon.svg, générer les PNG (nécessite inkscape ou imagemagick)
# Avec inkscape:
inkscape icon.svg -w 192 -h 192 -o icon-192x192.png
inkscape icon.svg -w 512 -h 512 -o icon-512x512.png

# Avec imagemagick:
convert -background none icon.svg -resize 192x192 icon-192x192.png
convert -background none icon.svg -resize 512x512 icon-512x512.png

cd ../..
```

---

## Déploiement Rapide

### Avec le Script Automatisé

#### Linux/Mac

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Déploiement complet
./deploy.sh deploy

# Voir l'état
./deploy.sh status
```

#### Windows (PowerShell)

```powershell
# Déploiement complet
.\deploy.ps1 deploy

# Voir l'état
.\deploy.ps1 status
```

Le script effectue automatiquement:
1. Construction des images Docker
2. Import dans K3s
3. Déploiement de tous les composants
4. Vérification de l'état

---

## Déploiement Manuel

### Étape 1: Construire les Images

```bash
# Backend
cd backend
docker build -t coach-app-backend:latest .
cd ..

# Frontend
cd frontend
docker build -t coach-app-frontend:latest .
cd ..
```

### Étape 2: Importer dans K3s (Linux seulement)

```bash
# K3s utilise containerd, pas docker
docker save coach-app-backend:latest | sudo k3s ctr images import -
docker save coach-app-frontend:latest | sudo k3s ctr images import -
```

Sur Docker Desktop, les images sont automatiquement disponibles.

### Étape 3: Créer le Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### Étape 4: Appliquer les Secrets

```bash
kubectl apply -f k8s/secrets.yaml
# Ou créez-les manuellement (voir section Configuration)
```

### Étape 5: Déployer MongoDB

```bash
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml

# Vérifier que MongoDB est prêt
kubectl wait --for=condition=ready pod -l app=mongodb -n coach-app --timeout=120s
```

### Étape 6: Déployer le Backend

```bash
kubectl apply -f k8s/backend-deployment.yaml

# Vérifier que le backend est prêt
kubectl wait --for=condition=ready pod -l app=backend -n coach-app --timeout=120s
```

### Étape 7: Déployer le Frontend

```bash
kubectl apply -f k8s/frontend-deployment.yaml

# Vérifier que le frontend est prêt
kubectl wait --for=condition=ready pod -l app=frontend -n coach-app --timeout=120s
```

### Étape 8: Créer l'Ingress

```bash
kubectl apply -f k8s/ingress.yaml
```

---

## Vérification

### Vérifier les Pods

```bash
kubectl get pods -n coach-app

# Tous les pods doivent être "Running" et "Ready"
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-xxxxxxxxx-xxxxx     1/1     Running   0          2m
# backend-xxxxxxxxx-xxxxx     1/1     Running   0          2m
# frontend-xxxxxxxxx-xxxxx    1/1     Running   0          1m
# frontend-xxxxxxxxx-xxxxx    1/1     Running   0          1m
# mongodb-xxxxxxxxx-xxxxx     1/1     Running   0          3m
```

### Vérifier les Services

```bash
kubectl get services -n coach-app

# NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)
# backend-service    ClusterIP   10.43.xxx.xxx   <none>        5000/TCP
# frontend-service   ClusterIP   10.43.xxx.xxx   <none>        80/TCP
# mongodb-service    ClusterIP   10.43.xxx.xxx   <none>        27017/TCP
```

### Vérifier l'Ingress

```bash
kubectl get ingress -n coach-app

# NAME                 CLASS     HOSTS              ADDRESS         PORTS
# coach-app-ingress    traefik   coach-app.local    192.168.1.100   80
```

### Logs

```bash
# Logs du backend
kubectl logs -l app=backend -n coach-app --tail=50

# Logs du frontend
kubectl logs -l app=frontend -n coach-app --tail=50

# Logs de MongoDB
kubectl logs -l app=mongodb -n coach-app --tail=50

# Suivre les logs en temps réel
kubectl logs -l app=backend -n coach-app -f
```

---

## Accès à l'Application

### Méthode 1: Ingress (Recommandé)

1. **Configurer /etc/hosts**

   **Linux/Mac:**
   ```bash
   sudo nano /etc/hosts
   # Ajouter:
   127.0.0.1 coach-app.local
   ```

   **Windows:**
   ```powershell
   # Ouvrir PowerShell en tant qu'Administrateur
   notepad C:\Windows\System32\drivers\etc\hosts
   # Ajouter:
   127.0.0.1 coach-app.local
   ```

2. **Accéder à l'application**

   Ouvrir le navigateur: http://coach-app.local

### Méthode 2: Port Forwarding (Développement)

```bash
# Script automatique
./deploy.sh port-forward

# Ou manuellement
kubectl port-forward -n coach-app service/frontend-service 8080:80 &
kubectl port-forward -n coach-app service/backend-service 8081:5000 &
```

Accès:
- Frontend: http://localhost:8080
- Backend: http://localhost:8081

---

## Maintenance

### Mise à Jour de l'Application

```bash
# Avec le script
./deploy.sh update

# Ou manuellement
docker build -t coach-app-backend:latest backend/
docker build -t coach-app-frontend:latest frontend/

kubectl rollout restart deployment/backend -n coach-app
kubectl rollout restart deployment/frontend -n coach-app
```

### Mise à l'Échelle

```bash
# Augmenter le nombre de replicas backend
kubectl scale deployment backend --replicas=3 -n coach-app

# Augmenter le nombre de replicas frontend
kubectl scale deployment frontend --replicas=4 -n coach-app
```

### Sauvegarde MongoDB

```bash
# Se connecter au pod MongoDB
kubectl exec -it -n coach-app $(kubectl get pod -l app=mongodb -n coach-app -o jsonpath='{.items[0].metadata.name}') -- bash

# Faire un dump
mongodump --username admin --password <password> --authenticationDatabase admin --out /data/backup

# Copier le backup localement
kubectl cp coach-app/<mongodb-pod-name>:/data/backup ./mongodb-backup
```

### Restauration MongoDB

```bash
# Copier le backup dans le pod
kubectl cp ./mongodb-backup coach-app/<mongodb-pod-name>:/data/restore

# Se connecter au pod
kubectl exec -it -n coach-app <mongodb-pod-name> -- bash

# Restaurer
mongorestore --username admin --password <password> --authenticationDatabase admin /data/restore
```

### Suppression

```bash
# Avec le script
./deploy.sh clean

# Ou manuellement
kubectl delete namespace coach-app
```

---

## Troubleshooting

### Les Pods ne Démarrent Pas

```bash
# Voir les événements
kubectl get events -n coach-app --sort-by='.lastTimestamp'

# Décrire un pod spécifique
kubectl describe pod <pod-name> -n coach-app

# Voir les logs
kubectl logs <pod-name> -n coach-app
```

### Erreur "ImagePullBackOff"

Les images Docker ne sont pas trouvées:

```bash
# Vérifier les images (Docker Desktop)
docker images | grep coach-app

# Vérifier les images (K3s)
sudo k3s ctr images list | grep coach-app

# Réimporter si nécessaire (K3s)
docker save coach-app-backend:latest | sudo k3s ctr images import -
docker save coach-app-frontend:latest | sudo k3s ctr images import -
```

### MongoDB ne Démarre Pas

```bash
# Vérifier le PVC
kubectl get pvc -n coach-app

# Vérifier les logs MongoDB
kubectl logs -l app=mongodb -n coach-app

# Problème de permissions? Supprimer et recréer
kubectl delete -f k8s/mongodb-deployment.yaml
kubectl delete pvc mongodb-pvc -n coach-app
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
```

### Backend ne Peut pas se Connecter à MongoDB

```bash
# Vérifier que MongoDB est accessible
kubectl exec -it -n coach-app $(kubectl get pod -l app=backend -n coach-app -o jsonpath='{.items[0].metadata.name}') -- sh

# Dans le pod backend
ping mongodb-service
# Ou
nslookup mongodb-service

# Vérifier les secrets
kubectl get secret backend-secret -n coach-app -o yaml
```

### Ingress ne Fonctionne Pas

```bash
# Vérifier Traefik (K3s)
kubectl get pods -n kube-system | grep traefik

# Vérifier les services
kubectl get svc -n kube-system

# Pour K3d, vérifier le mapping de ports
k3d cluster list
```

### Health Checks Échouent

```bash
# Tester manuellement
kubectl exec -it -n coach-app <backend-pod> -- wget -O- http://localhost:5000/api/health

# Si le endpoint n'existe pas, ajouter-le au backend
```

Ajoutez dans `backend/server.js`:

```javascript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

### Port Forward Bloqué

```bash
# Tuer les processus existants
pkill -f "port-forward"

# Ou sur Windows
Get-Process | Where-Object {$_.ProcessName -like "*kubectl*"} | Stop-Process
```

---

## Architecture

### Vue d'Ensemble

```
                              ┌─────────────────┐
                              │   Ingress       │
                              │  (Traefik)      │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
              /api requests      / requests         /health
                    │                  │                  │
            ┌───────▼───────┐  ┌───────▼───────┐         │
            │   Backend     │  │   Frontend    │         │
            │   Service     │  │   Service     │         │
            │ (ClusterIP)   │  │ (ClusterIP)   │         │
            └───────┬───────┘  └───────┬───────┘         │
                    │                  │                  │
         ┌──────────┼──────────┐       │                  │
         │          │          │       │                  │
    ┌────▼────┐┌────▼────┐    │  ┌────▼────┐        ┌────▼────┐
    │Backend  ││Backend  │    │  │Frontend ││        │Frontend │
    │Pod 1    ││Pod 2    │    │  │Pod 1    ││        │Pod 2    │
    │(Node.js)││(Node.js)│    │  │(Nginx)  ││        │(Nginx)  │
    └────┬────┘└────┬────┘    │  └─────────┘        └─────────┘
         │          │          │
         └──────────┼──────────┘
                    │
            ┌───────▼───────┐
            │   MongoDB     │
            │   Service     │
            │ (ClusterIP)   │
            └───────┬───────┘
                    │
            ┌───────▼───────┐
            │   MongoDB     │
            │   Pod         │
            │               │
            └───────┬───────┘
                    │
            ┌───────▼───────┐
            │   Persistent  │
            │   Volume      │
            │   (5GB)       │
            └───────────────┘
```

### Composants

| Composant | Type | Replicas | Ressources | Port |
|-----------|------|----------|------------|------|
| Frontend | Deployment | 2 | 128Mi-256Mi / 100m-200m CPU | 80 |
| Backend | Deployment | 2 | 256Mi-512Mi / 250m-500m CPU | 5000 |
| MongoDB | Deployment | 1 | 256Mi-512Mi / 250m-500m CPU | 27017 |

### Volumes

- **mongodb-pvc**: 5GB PersistentVolumeClaim pour les données MongoDB
- **storageClassName**: local-path (K3s par défaut)

### Secrets

- **mongodb-secret**: Credentials MongoDB
- **backend-secret**: JWT secret et MongoDB URI

### Network

- **Ingress**: Traefik (K3s default) route le trafic HTTP
- **Services**: ClusterIP pour communication interne
- **Port Forwarding**: Pour développement local

### Images Docker

#### Backend
- Base: `node:20-alpine`
- Multi-stage: dependencies + production
- Security: Non-root user (nodejs:1001)
- Health checks: HTTP GET /api/health
- Size: ~150MB

#### Frontend
- Base: `nginx:1.25-alpine`
- Multi-stage: build (node) + production (nginx)
- Security: Non-root user (nginx-custom:1001)
- Gzip compression activé
- Service worker et PWA manifest
- Size: ~50MB

---

## Ressources Utilisées

### Totales

- **CPU**: ~1.2 cores (requests) / ~2.4 cores (limits)
- **RAM**: ~896 Mi (requests) / ~1.7 Gi (limits)
- **Stockage**: 5 Gi (MongoDB)

### Par Environnement

**Développement Local** (minimum):
- 2 CPU cores
- 4 GB RAM
- 10 GB disque

**Production** (recommandé):
- 4 CPU cores
- 8 GB RAM
- 50 GB disque

---

## Commandes Utiles

```bash
# Voir tous les composants
kubectl get all -n coach-app

# Surveiller les ressources
kubectl top pods -n coach-app
kubectl top nodes

# Se connecter à un pod
kubectl exec -it -n coach-app <pod-name> -- sh

# Copier des fichiers
kubectl cp <local-file> coach-app/<pod-name>:<remote-path>

# Modifier un deployment
kubectl edit deployment backend -n coach-app

# Voir la configuration d'un service
kubectl describe service backend-service -n coach-app

# Redémarrer un deployment
kubectl rollout restart deployment/backend -n coach-app

# Voir l'historique des rollouts
kubectl rollout history deployment/backend -n coach-app

# Rollback vers une version précédente
kubectl rollout undo deployment/backend -n coach-app
```

---

## Sécurité

### Recommandations

1. **Secrets**
   - Jamais de secrets en clair dans Git
   - Utiliser `kubectl create secret` ou un gestionnaire de secrets (Vault, Sealed Secrets)
   - Rotation régulière des secrets

2. **Images**
   - Scanner les vulnérabilités (`docker scan`)
   - Utiliser des images minimales (alpine)
   - Mettre à jour régulièrement les dépendances

3. **Network Policies**
   - Limiter la communication entre pods
   - Créer des NetworkPolicies pour isoler MongoDB

4. **RBAC**
   - Créer des ServiceAccounts dédiés
   - Limiter les permissions

5. **Monitoring**
   - Installer Prometheus + Grafana
   - Alertes sur les ressources
   - Logs centralisés

---

## Performance

### Optimisations Appliquées

1. **Multi-stage Docker builds** - Images réduites
2. **Non-root users** - Sécurité renforcée
3. **Health checks** - Auto-healing
4. **Resource limits** - Prévention OOM
5. **Gzip compression** - Nginx
6. **Code splitting** - React lazy loading
7. **Service Worker** - PWA caching
8. **2 replicas** - High availability

### Monitoring

```bash
# Ressources en temps réel
kubectl top pods -n coach-app

# Surveiller les événements
kubectl get events -n coach-app --watch

# Logs agrégés
kubectl logs -l app=backend -n coach-app --all-containers=true
```

---

## Support

Pour toute question ou problème:

1. Consulter les logs: `kubectl logs -l app=<component> -n coach-app`
2. Vérifier les événements: `kubectl get events -n coach-app`
3. Voir le statut: `./deploy.sh status`
4. Consulter la documentation K3s: https://k3s.io/
5. Documentation Kubernetes: https://kubernetes.io/docs/

---

## Changelog

### Version 1.0 (2025-12-02)

- Déploiement initial K3s
- Support Linux, Windows, Mac
- MongoDB avec persistent volume
- Backend (Node.js) avec 2 replicas
- Frontend (React + Nginx) avec 2 replicas
- Ingress Traefik configuré
- Scripts de déploiement automatisés
- Health checks et resource limits
- Documentation complète

---

**Coach App Wattrelos FC - U12**
Développé avec ❤️ pour les jeunes footballeurs
