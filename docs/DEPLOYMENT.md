# Coach App - Guide de Déploiement

Guide complet pour déployer Coach App sur différents environnements.

## Table des Matières

- [Prérequis](#prérequis)
- [Architecture](#architecture)
- [Déploiement Local](#déploiement-local)
- [Déploiement Preprod](#déploiement-preprod)
- [Déploiement Production](#déploiement-production)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## Prérequis

### Outils Requis

- **kubectl** (v1.28+)
- **kustomize** (v5.0+) - installé automatiquement par le script de déploiement
- **docker** (v24+) - pour build des images
- **git** - pour cloner le repository

### Accès Cluster

Assurez-vous d'avoir accès à un cluster Kubernetes :

```bash
# Vérifier la connexion
kubectl cluster-info
kubectl get nodes
```

## Architecture

L'application est organisée en 3 environnements :

```
environments/
├── base/          # Configurations communes (MongoDB, Backend, Frontend)
├── local/         # Développement local (1 replica, Ingress)
├── preprod/       # Pré-production (2 replicas, HPA, Ingress)
└── production/    # Production (3+ replicas, HPA, NodePort, NetworkPolicies)
```

## Déploiement Local

Pour le développement local sur K3s/K8s.

### 1. Build des Images

```bash
# Avec docker-compose
docker-compose build

# Tag pour Kubernetes
docker tag coach_app-frontend:latest coach-app-frontend:latest
docker tag coach_app-backend:latest coach-app-backend:latest
```

### 2. Déployer

```bash
# Méthode 1: Script automatique
./deploy.sh local deploy

# Méthode 2: Manuel avec kustomize
kubectl apply -k environments/local
```

### 3. Accès

Ajouter à `/etc/hosts` :
```
127.0.0.1 coach-app.local
```

Accéder à : **http://coach-app.local**

### 4. Vérification

```bash
# Status
./deploy.sh local status

# Logs
./deploy.sh local logs
```

## Déploiement Preprod

Pour les tests en pré-production.

### 1. Prérequis

- Images poussées dans GitLab Registry
- Secrets configurés (ou Sealed Secrets)

### 2. Configuration des Secrets

Option A - Secrets standards (pour test) :
```bash
kubectl create secret generic mongodb-secret \
  --from-literal=username=admin \
  --from-literal=password=YOUR_PASSWORD \
  -n coach-app

kubectl create secret generic backend-secret \
  --from-literal=jwt-secret=$(openssl rand -base64 32) \
  --from-literal=mongodb-uri=mongodb://admin:YOUR_PASSWORD@mongodb-service:27017/coach_app?authSource=admin \
  -n coach-app
```

Option B - Sealed Secrets (recommandé) :
```bash
# Installer Sealed Secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

# Créer sealed secrets
./scripts/create-sealed-secret.sh preprod
```

### 3. Configurer Image Pull Secrets

Pour GitLab Container Registry :

```bash
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<username> \
  --docker-password=<deploy-token> \
  --docker-email=<email> \
  -n coach-app
```

### 4. Déployer

```bash
# Via script
./deploy.sh preprod deploy

# Ou manuel
kubectl apply -k environments/preprod
```

### 5. Vérifier HPA

```bash
kubectl get hpa -n coach-app
kubectl describe hpa backend-hpa -n coach-app
```

## Déploiement Production

### Option A: GitOps avec ArgoCD (Recommandé)

#### 1. Installer ArgoCD

```bash
./scripts/setup-argocd.sh
```

Le script va :
- Installer ArgoCD
- Installer Sealed Secrets Controller
- Créer le projet Coach App
- Configurer les applications

#### 2. Créer Sealed Secrets

```bash
./scripts/create-sealed-secret.sh production
```

Cela va générer `environments/production/sealed-secrets.yaml` avec les secrets chiffrés.

#### 3. Commit et Push

```bash
git add environments/production/sealed-secrets.yaml
git commit -m "Add production sealed secrets"
git push origin main
```

#### 4. ArgoCD Sync

ArgoCD va automatiquement détecter les changements et synchroniser.

Vous pouvez aussi forcer une sync :
```bash
# Via CLI
argocd app sync coach-app-production

# Ou via UI
# https://localhost:8080
```

#### 5. Configurer Apache Proxy

Sur votre serveur de production, configurez Apache pour router vers les NodePorts :

```apache
<VirtualHost *:80>
    ServerName coach-app.votredomaine.com
    
    # Frontend
    ProxyPass / http://localhost:30080/
    ProxyPassReverse / http://localhost:30080/
    
    # Backend API
    ProxyPass /api http://localhost:30500/api
    ProxyPassReverse /api http://localhost:30500/api
    
    # Optionnel: HTTPS
    # Include /etc/letsencrypt/options-ssl-apache.conf
    # SSLCertificateFile /etc/letsencrypt/live/coach-app.votredomaine.com/fullchain.pem
    # SSLCertificateKeyFile /etc/letsencrypt/live/coach-app.votredomaine.com/privkey.pem
</VirtualHost>
```

Redémarrer Apache :
```bash
sudo systemctl restart apache2
```

### Option B: Déploiement Manuel

```bash
# Build et push images
./deploy.sh production build

# Créer sealed secrets
./scripts/create-sealed-secret.sh production

# Déployer
kubectl apply -k environments/production
```

## Maintenance

### Mise à Jour de l'Application

#### Avec ArgoCD (Production)

1. Commit les changements
2. Push vers le repository
3. ArgoCD sync automatiquement

```bash
git add .
git commit -m "Update application"
git push origin main
```

#### Sans ArgoCD

```bash
# Rebuild images
./deploy.sh production build

# Redeploy
kubectl rollout restart deployment/backend -n coach-app
kubectl rollout restart deployment/frontend -n coach-app
```

### Scaler Manuellement

```bash
# Scaler backend
kubectl scale deployment backend --replicas=5 -n coach-app

# Scaler frontend
kubectl scale deployment frontend --replicas=5 -n coach-app
```

Note: En production, HPA va automatiquement scaler basé sur la charge.

### Rollback

#### Avec ArgoCD

```bash
# Lister l'historique
argocd app history coach-app-production

# Rollback vers une révision
argocd app rollback coach-app-production <revision-number>
```

#### Sans ArgoCD

```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n coach-app
kubectl rollout undo deployment/frontend -n coach-app

# Ou vers une révision spécifique
kubectl rollout undo deployment/backend --to-revision=2 -n coach-app
```

### Backup MongoDB

```bash
# Exec dans le pod MongoDB
kubectl exec -it deployment/mongodb -n coach-app -- mongodump \
  --username=admin \
  --password=<password> \
  --authenticationDatabase=admin \
  --db=coach_app \
  --out=/tmp/backup

# Copier le backup
kubectl cp coach-app/mongodb-<pod-id>:/tmp/backup ./mongodb-backup
```

### Restore MongoDB

```bash
# Copier backup vers pod
kubectl cp ./mongodb-backup coach-app/mongodb-<pod-id>:/tmp/backup

# Restore
kubectl exec -it deployment/mongodb -n coach-app -- mongorestore \
  --username=admin \
  --password=<password> \
  --authenticationDatabase=admin \
  --db=coach_app \
  /tmp/backup/coach_app
```

## Troubleshooting

### Pods ne démarrent pas

```bash
# Vérifier status
kubectl get pods -n coach-app

# Logs détaillés
kubectl describe pod <pod-name> -n coach-app

# Logs runtime
kubectl logs <pod-name> -n coach-app
```

### Image Pull Errors

```bash
# Vérifier secret existe
kubectl get secret gitlab-registry -n coach-app

# Recréer si nécessaire
kubectl delete secret gitlab-registry -n coach-app
kubectl create secret docker-registry gitlab-registry ...
```

### Base de données inaccessible

```bash
# Vérifier MongoDB est running
kubectl get pods -l app=mongodb -n coach-app

# Test connexion depuis backend
kubectl exec -it deployment/backend -n coach-app -- nc -zv mongodb-service 27017

# Logs MongoDB
kubectl logs deployment/mongodb -n coach-app
```

### Ingress ne fonctionne pas

```bash
# Vérifier Ingress
kubectl get ingress -n coach-app
kubectl describe ingress coach-app-ingress -n coach-app

# Vérifier Traefik (K3s)
kubectl get pods -n kube-system -l app.kubernetes.io/name=traefik

# Logs Traefik
kubectl logs -n kube-system -l app.kubernetes.io/name=traefik
```

### HPA ne scale pas

```bash
# Vérifier metrics-server
kubectl get deployment metrics-server -n kube-system

# Si absent, installer
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Vérifier métriques disponibles
kubectl top pods -n coach-app
kubectl top nodes
```

### NetworkPolicy bloque le trafic

```bash
# Lister NetworkPolicies
kubectl get networkpolicies -n coach-app

# Détails
kubectl describe networkpolicy <policy-name> -n coach-app

# Temporairement désactiver (DEBUG ONLY!)
kubectl delete networkpolicy --all -n coach-app
```

### ArgoCD Out of Sync

```bash
# Check diff
argocd app diff coach-app-production

# Force refresh
argocd app get coach-app-production --refresh

# Hard refresh
argocd app get coach-app-production --hard-refresh

# Sync
argocd app sync coach-app-production --prune
```

## Commandes Utiles

### Monitoring

```bash
# Watch pods
kubectl get pods -n coach-app -w

# Resource usage
kubectl top pods -n coach-app
kubectl top nodes

# Events
kubectl get events -n coach-app --sort-by='.lastTimestamp'
```

### Logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n coach-app

# Frontend logs
kubectl logs -f deployment/frontend -n coach-app

# MongoDB logs
kubectl logs -f deployment/mongodb -n coach-app

# Tous les logs backend
kubectl logs -l app=backend -n coach-app --tail=100
```

### Debug

```bash
# Shell dans un pod
kubectl exec -it deployment/backend -n coach-app -- /bin/sh

# Port-forward pour debug local
kubectl port-forward deployment/backend -n coach-app 5000:5000
kubectl port-forward deployment/frontend -n coach-app 8080:80
kubectl port-forward deployment/mongodb -n coach-app 27017:27017
```

## Ressources

- [Documentation ArgoCD](argocd/README.md)
- [Documentation Kustomize](https://kustomize.io/)
- [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets)
- [K3s Documentation](https://docs.k3s.io/)
