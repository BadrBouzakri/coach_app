# ACCÈS À L'APPLICATION - Guide Rapide

## ✅ Application Déployée et Accessible

### Accès depuis Windows

**Frontend (Interface Web)** :
- URL: http://localhost:8080
- OU: http://192.168.218.143:8080

**Backend API** :
- Health Check: http://localhost:8081/api/health
- API Base: http://localhost:8081/api

### Configuration Backend pour le Frontend

Le frontend doit appeler le backend via `http://localhost:8081/api` ou `http://192.168.218.143:8081/api`.

Si vous voyez des erreurs réseau dans la console du navigateur, vérifiez que l'URL de l'API est correcte dans le code frontend.

### Port-Forwards Actifs

```bash
# Frontend
kubectl port-forward -n coach-app --address 0.0.0.0 service/frontend-service 8080:80

# Backend
kubectl port-forward -n coach-app --address 0.0.0.0 service/backend-service 8081:5000
```

## 📊 Status des Pods

Voir les pods de l'application :
```bash
kubectl get pods -n coach-app -l 'project=coach-app'
```

Expected output :
```
NAME                        READY   STATUS
backend-xxx                 1/1     Running
frontend-xxx                1/1     Running  
mongodb-xxx                 1/1     Running
```

## 🔧 Troubleshooting

### "Aucun pod visible"

Si vous ne voyez pas les pods, c'est probablement dû au label selector. Utilisez :
```bash
# Voir TOUS les pods du namespace
kubectl get pods -n coach-app

# Voir seulement ceux de la nouvelle structure
kubectl get pods -n coach-app | grep -E "backend-|frontend-|mongodb-" | grep -v "coach-app-"
```

### "ERR_CONNECTION_REFUSED" sur localhost:8080

1. Vérifier que le port-forward tourne :
   ```bash
   ps aux | grep "port-forward"
   ```

2. Si non, relancer :
   ```bash
   kubectl port-forward -n coach-app --address 0.0.0.0 service/frontend-service 8080:80 &
   kubectl port-forward -n coach-app --address 0.0.0.0 service/backend-service 8081:5000 &
   ```

### API ne répond pas

Vérifier le backend :
```bash
curl http://localhost:8081/api/health
```

Devrait retourner :
```json
{
  "uptime": xxx,
  "message": "OK",
  "mongodb": "connected"
}
```

## 📝 Notes

- Les port-forwards sont **temporaires** et s'arrêtent quand vous fermez le terminal
- Pour accès permanent, configurez le fichier `C:\Windows\System32\drivers\etc\hosts` Windows + utilisez l'Ingress
- L'application a besoin que frontend ET backend soient accessibles
