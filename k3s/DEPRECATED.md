# DEPRECATED - Ce dossier est obsolète

⚠️ **Ce dossier k3s/ est maintenant deprecated et conservé uniquement pour référence.**

## Nouvelle Structure

La configuration K3s a été migrée vers la structure multi-environnements moderne :

```
environments/
└── local/    # Configuration pour K3s local (anciennement k3s/)
```

## Migration

Les anciens fichiers ont été intégrés dans la nouvelle structure :

| Ancien fichier | Nouveau fichier |
|----------------|-----------------|
| `deployment.yaml` | `environments/base/frontend/deployment.yaml` |
| `backend-deployment.yaml` | `environments/base/backend/deployment.yaml` |
| `mongodb-deployment.yaml` | `environments/base/mongodb/deployment.yaml` |
| `mongodb-pvc.yaml` | `environments/base/mongodb/pvc.yaml` |
| `service.yaml` | `environments/base/*/service.yaml` |
| `kustomization.yaml` | `environments/local/kustomization.yaml` |

## Utilisation

**Ancien déploiement K3s** (deprecated):
```bash
kubectl apply -k k3s/
```

**Nouveau déploiement local** (recommandé):
```bash
./deploy.sh local deploy
```

Ou manuellement :
```bash
kubectl apply -k environments/local
```

## Avantages de la Nouvelle Structure

- ✅ Support multi-environnements (local, preprod, prod)
- ✅ Overlays Kustomize pour customisation par environnement
- ✅ Intégration avec ArgoCD pour GitOps
- ✅ Meilleure séparation des configurations
- ✅ Scripts de déploiement automatisés

## Documentation

Consultez :

- [Guide de déploiement](../docs/DEPLOYMENT.md)
- [README principal](../README.md)

---

**Ce dossier sera supprimé dans une version future.**
