# Coach App - Wattrelos FC

Application de coaching pour le Wattrelos Football Club avec architecture moderne multi-environnements et déploiement GitOps.

## 🏗️ Architecture

- **Frontend**: React 19 + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **Infrastructure**: Kubernetes (K3s/K8s) avec Kustomize
- **CI/CD**: GitLab CI avec pipeline multi-stages
- **GitOps**: ArgoCD pour déploiement automatisé en production

## 📁 Structure du Projet

```
coach_app/
├── frontend/                    # Application React
├── backend/                     # API Node.js/Express
├── environments/                # 🆕 Configurations Kubernetes
│   ├── base/                   # Ressources communes
│   ├── local/                  # Développement local (K3s)
│   ├── preprod/                # Pré-production
│   └── production/             # Production (avec ArgoCD)
├── argocd/                      # 🆕 Configurations ArgoCD
│   ├── projects/               # AppProjects
│   └── applications/           # Applications
├── scripts/                     # 🆕 Scripts utilitaires
│   ├── create-sealed-secret.sh # Génération de secrets chiffrés
│   ├── setup-argocd.sh         # Installation ArgoCD
│   └── ...
├── docs/                        # 🆕 Documentation
│   ├── DEPLOYMENT.md           # Guide de déploiement complet
│   └── ...
├── k8s/                         # ⚠️ DEPRECATED (voir environments/)
├── k3s/                         # ⚠️ DEPRECATED (voir environments/local)
├── .gitlab-ci.yml              # 🔄 Pipeline CI/CD amélioré
├── docker-compose.yml           # Développement Docker Compose
└── deploy.sh                    # 🔄 Script de déploiement multi-env
```

## 🚀 Quick Start

### Développement Local

#### Option 1: Docker Compose (Recommandé pour dev)

```bash
docker-compose up -d
```

Accès:
- Frontend: http://localhost:8080
- Backend: http://localhost:5000
- MongoDB: localhost:27017

#### Option 2: Kubernetes Local

```bash
# Déploiement automatique
./deploy.sh local deploy

# Accès via Ingress
# Ajouter à /etc/hosts: 127.0.0.1 coach-app.local
# URL: http://coach-app.local
```

### Déploiement Preprod

```bash
# Build et push images
./deploy.sh preprod build

# Déployer
./deploy.sh preprod deploy
```

### Déploiement Production (ArgoCD)

```bash
# 1. Installer ArgoCD (une seule fois)
./scripts/setup-argocd.sh

# 2. Créer sealed secrets
./scripts/create-sealed-secret.sh production

# 3. Commit et push
git add environments/production/sealed-secrets.yaml
git commit -m "Add production secrets"
git push origin main

# 4. ArgoCD sync automatiquement !
```

## 📚 Documentation

- **[Guide de Déploiement](docs/DEPLOYMENT.md)** - Guide complet par environnement
- **[Documentation ArgoCD](argocd/README.md)** - Configuration GitOps
- **[K3S Deployment](K3S_DEPLOYMENT.md)** - Guide K3s original (legacy)

## 🛠️ Commandes Utiles

### Déploiement

```bash
# Deploy
./deploy.sh [local|preprod|production] deploy

# Build images uniquement
./deploy.sh [env] build

# Status
./deploy.sh [env] status

# Logs
./deploy.sh [env] logs

# Supprimer
./deploy.sh [env] delete
```

### CI/CD GitLab

Le pipeline s'exécute automatiquement sur chaque push :

- **test** → Linting et tests unitaires
- **build** → Build frontend
- **docker** → Build et push images Docker
- **deploy-preprod** → Déploiement automatique preprod
- **deploy-production** → Déploiement manuel production via ArgoCD

### ArgoCD

```bash
# Sync application
argocd app sync coach-app-production

# Status
argocd app get coach-app-production

# Historique
argocd app history coach-app-production

# Rollback
argocd app rollback coach-app-production <revision>
```

## 🔧 Configuration

### Environnements

| Environnement | Replicas | Scaling | Ingress | Secrets |
|---------------|----------|---------|---------|---------|
| **local** | 1 | Statique | Traefik | Plain |
| **preprod** | 2-4 | HPA | Traefik | Sealed |
| **production** | 3-10 | HPA | NodePort → Apache | Sealed |

### Production - Configuration Apache

```apache
<VirtualHost *:80>
    ServerName coach-app.votredomaine.com
    
    ProxyPass / http://localhost:30080/
    ProxyPassReverse / http://localhost:30080/
    
    ProxyPass /api http://localhost:30500/api
    ProxyPassReverse /api http://localhost:30500/api
</VirtualHost>
```

## 🔒 Sécurité

### Production Features

- ✅ **Sealed Secrets** pour chiffrement des secrets
- ✅ **NetworkPolicies** pour isolation réseau
- ✅ **RBAC** via ArgoCD projects
- ✅ **Resource Limits** configurés
- ✅ **Health Checks** (liveness & readiness probes)
- ✅ **Image scanning** via GitLab CI (à activer)

### Créer des Secrets Sécurisés

```bash
# Pour preprod ou production
./scripts/create-sealed-secret.sh production

# Le script vous demandera:
# - MongoDB username/password
# - JWT secret (ou génération auto)
# - Créera les sealed secrets chiffrés
```

## 📊 Monitoring & Logs

```bash
# Status général
kubectl get all -n coach-app

# Logs en temps réel
kubectl logs -f deployment/backend -n coach-app
kubectl logs -f deployment/frontend -n coach-app

# Métriques
kubectl top pods -n coach-app
kubectl get hpa -n coach-app
```

## 🔄 Workflow de Développement

1. **Développer localement** avec Docker Compose ou K8s local
2. **Commit** et **push** vers GitLab
3. **Pipeline CI** s'exécute automatiquement
4. **Preprod** se déploie automatiquement
5. **Tester** en preprod
6. **Merge** vers main
7. **Production** via ArgoCD (sync automatique ou manuel)

## 🆘 Troubleshooting

Consultez le [Guide de Déploiement](docs/DEPLOYMENT.md#troubleshooting) pour :

- Pods qui ne démarrent pas
- Erreurs de pull d'images
- Problèmes de connexion à MongoDB
- Ingress non fonctionnel
- HPA qui ne scale pas
- NetworkPolicies bloquant le trafic
- ArgoCD out of sync

## 🤝 Contribution

1. Créer une branche feature
2. Développer et tester localement
3. Commit avec messages conventionnels
4. Push et créer une Merge Request
5. Attendre validation CI/CD
6. Merge après review

## 📝 Changelog

### v2.0.0 (2025-12) - Infrastructure Modernization

- ✨ Architecture multi-environnements avec Kustomize
- ✨ GitOps avec ArgoCD
- ✨ CI/CD pipeline amélioré (5 stages)
- ✨ Sealed Secrets pour sécurité
- ✨ NetworkPolicies en production
- ✨ HPA pour autoscaling
- ✨ Scripts d'automatisation
- ✨ Documentation complète
- ⚠️ Deprecated k8s/ et k3s/ (migration vers environments/)

### v1.0.0 - Version Initiale

- Application frontend React
- Backend API Node.js
- Déploiement K3s basique

## 📄 Licence

Propriétaire - Wattrelos FC

## 👥 Équipe

Développé pour le Wattrelos Football Club

---

**Pour plus d'informations, consultez la [documentation complète](docs/DEPLOYMENT.md).**
