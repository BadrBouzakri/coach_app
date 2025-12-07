# Résolution du Problème kubectl

## Problème Actuel

Le cluster Kubernetes Docker Desktop a un problème d'authentification. La configuration kubectl ne parvient pas à se connecter au cluster.

## Solutions

### Solution 1: Redémarrer Docker Desktop (Recommandé)

La meilleure façon de résoudre ce problème :

1. **Redémarrer Docker Desktop** complètement :
   ```bash
   # Windows (PowerShell en administrat eur)
   Restart-Service docker
   
   # Ou via l'interface Docker Desktop:
   # Clic droit sur l'icône → Quit Docker Desktop
   # Puis relancer Docker Desktop
   ```

2. **Attendre que Kubernetes redémarre** (icône verte dans Docker Desktop)

3. **Tester la connexion** :
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

### Solution 2: Réinitialiser le Cluster Kubernetes

Via Docker Desktop :
1. Ouvrir Docker Desktop
2. Aller dans **Settings** → **Kubernetes**  
3. Cliquer sur **Reset Kubernetes Cluster**
4. Attendre la réinitialisation
5. Tester : `kubectl cluster-info`

### Solution 3: Utiliser Docker Compose (Alternative Immédiate)

Pour tester l'application immédiatement sans Kubernetes :

```bash
# Démarrer avec Docker Compose
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

**Accès** :
- Frontend : http://localhost:8080
- Backend : http://localhost:5000
- MongoDB : localhost:27017

### Solution 4: Réparer kubectl config manuellement

Si Docker Desktop ne résout pas le problème, sauvegardez et réparez :

```bash
# Backup
cp ~/.kube/config ~/.kube/config.backup

# Vérifier les contextes disponibles
kubectl config get-contexts

# Ré-initialiser config depuis Docker Desktop
# (Nécessite que Docker Desktop Kubernetes soit actif)
```

## Test Rapide avec Docker Compose

Vous pouvez tester l'application immédiatement pendant la résolution du problème kubectl :

```bash
cd /mnt/d/Tech/IA/gravity/coach_app
docker-compose up --build
```

Cela permettra de valider que l'application fonctionne correctement avant de déployer sur Kubernetes.

## Note

La nouvelle infrastructure Kubernetes (dossier `environments/`) sera utilisable une fois que kubectl fonctionnera correctement. En attendant, Docker Compose est une excellente alternative pour le développement.
