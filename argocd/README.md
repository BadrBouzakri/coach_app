# ArgoCD Configuration for Coach App

This directory contains ArgoCD Application and Project manifests for GitOps deployment.

## Structure

```
argocd/
├── projects/
│   └── coach-app-project.yaml     # AppProject definition
└── applications/
    ├── coach-app-preprod.yaml     # Preprod application
    └── coach-app-production.yaml  # Production application
```

## Prerequisites

1. **ArgoCD installed** on your cluster:
   ```bash
   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

2. **Access ArgoCD UI**:
   ```bash
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```
   
   Get initial admin password:
   ```bash
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
   ```

3. **ArgoCD CLI** (optional):
   ```bash
   # Linux
   curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
   sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
   rm argocd-linux-amd64
   ```

## Deployment

### 1. Create the AppProject

```bash
kubectl apply -f argocd/projects/coach-app-project.yaml
```

### 2. Deploy Applications

**Preprod**:
```bash
kubectl apply -f argocd/applications/coach-app-preprod.yaml
```

**Production**:
```bash
kubectl apply -f argocd/applications/coach-app-production.yaml
```

### 3. Configure GitLab Repository Access

If your repository is private, create a secret:

```bash
argocd repo add https://gitlab.com/bouzakri.badr/coach_app.git \
  --username <your-username> \
  --password <gitlab-token>
```

Or via kubectl:
```bash
kubectl create secret generic gitlab-repo-secret \
  --from-literal=username=<username> \
  --from-literal=password=<token> \
  -n argocd
```

### 4. Configure Image Registry

For GitLab Container Registry:

```bash
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<username> \
  --docker-password=<deploy-token> \
  --docker-email=<email> \
  -n coach-app
```

Add to deployments:
```yaml
spec:
  template:
    spec:
      imagePullSecrets:
      - name: gitlab-registry
```

## Sync Policies

### Preprod
- **Auto-sync**: Enabled
- **Self-heal**: Enabled
- **Prune**: Enabled (removes resources deleted from Git)

### Production
- **Auto-sync**: Enabled
- **Self-heal**: Enabled
- **Prune**: Disabled (manual approval required for deletions)

## Usage

### View Application Status

```bash
# CLI
argocd app get coach-app-production
argocd app get coach-app-preprod

# kubectl
kubectl get applications -n argocd
```

### Manual Sync

```bash
argocd app sync coach-app-production
```

### View Sync History

```bash
argocd app history coach-app-production
```

### Rollback

```bash
# List history
argocd app history coach-app-production

# Rollback to specific revision
argocd app rollback coach-app-production <revision-id>
```

### Refresh (fetch latest from Git)

```bash
argocd app get coach-app-production --refresh
```

## Health Checks

ArgoCD monitors:
- Pod status
- Deployment readiness
- Service endpoints
- Ingress status

Applications will show as "Healthy" when all resources are running correctly.

## Notifications (Optional)

Enable notifications to Slack/email on sync events:

1. Install argocd-notifications:
   ```bash
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/notifications_catalog/install.yaml
   ```

2. Configure in application annotations:
   ```yaml
   annotations:
     notifications.argoproj.io/subscribe.on-sync-succeeded.slack: coach-app-channel
   ```

## Troubleshooting

### Application Not Syncing

```bash
# Check application events
argocd app get coach-app-production --show-operation

# Check ArgoCD logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```

### Authentication Issues

```bash
# Re-add repository
argocd repo add https://gitlab.com/bouzakri.badr/coach_app.git --username <user> --password <token>
```

### Image Pull Errors

```bash
# Verify secret exists
kubectl get secret gitlab-registry -n coach-app

# Recreate if needed
kubectl delete secret gitlab-registry -n coach-app
kubectl create secret docker-registry gitlab-registry ...
```

## Best Practices

1. **Always commit to Git first** - ArgoCD syncs from Git, not local changes
2. **Use branches** - Test changes in preprod before merging to main
3. **Monitor health** - Check ArgoCD UI regularly
4. **Review sync diffs** - Understand what will change before syncing
5. **Keep secrets encrypted** - Use Sealed Secrets for production

## Links

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [GitLab CI/CD Integration](https://docs.gitlab.com/ee/ci/)
- [Kustomize Documentation](https://kustomize.io/)
