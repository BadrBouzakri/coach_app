# DEPRECATED - Ce dossier est obsolète

⚠️ **Ce dossier k8s/ est maintenant deprecated et conservé uniquement pour référence.**

## Nouvelle Structure

La configuration Kubernetes a été migrée vers une structure multi-environnements moderne avec Kustomize :

```
environments/
├── base/          # Configurations de base communes
├── local/         # Environnement local
├── preprod/       # Environnement de pré-production  
└── production/    # Environnement de production
```

## Migration

Les anciens fichiers de ce dossier ont été réorganisés comme suit :

| Ancien fichier | Nouveau fichier |
|----------------|-----------------|
| `namespace.yaml` | `environments/base/namespace.yaml` |
| `mongodb-pvc.yaml` | `environments/base/mongodb/pvc.yaml` |
| `mongodb-deployment.yaml` | `environments/base/mongodb/deployment.yaml` |
| `backend-deployment.yaml` | `environments/base/backend/deployment.yaml` |
| `frontend-deployment.yaml` | `environments/base/frontend/deployment.yaml` |
| `ingress.yaml` | `environments/local/ingress.yaml` et `environments/preprod/ingress.yaml` |
| `secrets.yaml` | `environments/{env}/secrets.yaml` ou `sealed-secrets.yaml` |

## Utilisation

**Ancien déploiement** (deprecated):
```bash
kubectl apply -f k8s/
```

**Nouveau déploiement** (recommandé):
```bash
# Local
./deploy.sh local deploy

# Preprod
./deploy.sh preprod deploy

# Production (via ArgoCD)
argocd app sync coach-app-production
```

## Documentation

Consultez la nouvelle documentation :

- [Guide de déploiement](../docs/DEPLOYMENT.md)
- [Documentation ArgoCD](../argocd/README.md)
- [README principal](../README.md)

---

**Ce dossier sera supprimé dans une version future.**
