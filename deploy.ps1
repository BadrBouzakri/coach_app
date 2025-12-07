# Script PowerShell de déploiement pour Coach App sur K3s (Windows)
# Usage: .\deploy.ps1 [build|deploy|update|clean|logs|status]

param(
    [Parameter(Position=0)]
    [string]$Command = "help",

    [Parameter(Position=1)]
    [string]$Component = ""
)

# Configuration
$NAMESPACE = "coach-app"
$FRONTEND_IMAGE = "coach-app-frontend:latest"
$BACKEND_IMAGE = "coach-app-backend:latest"

# Fonctions utilitaires
function Print-Step {
    param([string]$Message)
    Write-Host "==> " -ForegroundColor Blue -NoNewline
    Write-Host $Message -ForegroundColor Green
}

function Print-Warning {
    param([string]$Message)
    Write-Host "WARNING: " -ForegroundColor Yellow -NoNewline
    Write-Host $Message
}

function Print-Error {
    param([string]$Message)
    Write-Host "ERROR: " -ForegroundColor Red -NoNewline
    Write-Host $Message
}

function Check-K3s {
    if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
        Print-Error "kubectl n'est pas installé"
        exit 1
    }

    try {
        kubectl cluster-info | Out-Null
    } catch {
        Print-Error "Impossible de se connecter au cluster K3s"
        Print-Warning "Assurez-vous que K3s/Docker Desktop est démarré"
        exit 1
    }
}

function Build-Images {
    Print-Step "Construction des images Docker..."

    # Backend
    Print-Step "Construction de l'image backend..."
    Set-Location backend
    docker build -t $BACKEND_IMAGE .
    Set-Location ..

    # Frontend
    Print-Step "Construction de l'image frontend..."
    Set-Location frontend
    docker build -t $FRONTEND_IMAGE .
    Set-Location ..

    Print-Step "Images construites avec succès!"
}

function Deploy-App {
    Print-Step "Déploiement de l'application..."

    # Créer le namespace
    kubectl apply -f k8s/namespace.yaml

    # Appliquer les secrets
    Print-Step "Application des secrets..."
    kubectl apply -f k8s/secrets.yaml

    # Déployer MongoDB
    Print-Step "Déploiement de MongoDB..."
    kubectl apply -f k8s/mongodb-pvc.yaml
    kubectl apply -f k8s/mongodb-deployment.yaml

    # Attendre que MongoDB soit prêt
    Print-Step "Attente du démarrage de MongoDB..."
    kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=120s

    # Déployer le backend
    Print-Step "Déploiement du backend..."
    kubectl apply -f k8s/backend-deployment.yaml

    # Attendre que le backend soit prêt
    Print-Step "Attente du démarrage du backend..."
    kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=120s

    # Déployer le frontend
    Print-Step "Déploiement du frontend..."
    kubectl apply -f k8s/frontend-deployment.yaml

    # Attendre que le frontend soit prêt
    Print-Step "Attente du démarrage du frontend..."
    kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=120s

    # Créer l'ingress
    Print-Step "Configuration de l'ingress..."
    kubectl apply -f k8s/ingress.yaml

    Print-Step "Déploiement terminé!"
}

function Update-App {
    Print-Step "Mise à jour de l'application..."

    # Reconstruire les images
    Build-Images

    # Redémarrer les deployments
    kubectl rollout restart deployment/backend -n $NAMESPACE
    kubectl rollout restart deployment/frontend -n $NAMESPACE

    # Attendre la fin des rollouts
    kubectl rollout status deployment/backend -n $NAMESPACE
    kubectl rollout status deployment/frontend -n $NAMESPACE

    Print-Step "Mise à jour terminée!"
}

function Clean-App {
    Print-Step "Suppression de l'application..."

    $confirmation = Read-Host "Êtes-vous sûr de vouloir supprimer l'application? (y/N)"
    if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
        Print-Warning "Annulé"
        exit 0
    }

    kubectl delete namespace $NAMESPACE

    Print-Step "Application supprimée!"
}

function Show-Logs {
    param([string]$Component)

    if ([string]::IsNullOrEmpty($Component)) {
        Print-Error "Usage: .\deploy.ps1 logs [backend|frontend|mongodb]"
        exit 1
    }

    kubectl logs -l app=$Component -n $NAMESPACE --tail=100 -f
}

function Show-Status {
    Print-Step "État de l'application:"
    Write-Host ""

    Write-Host "Pods:" -ForegroundColor Blue
    kubectl get pods -n $NAMESPACE
    Write-Host ""

    Write-Host "Services:" -ForegroundColor Blue
    kubectl get services -n $NAMESPACE
    Write-Host ""

    Write-Host "Ingress:" -ForegroundColor Blue
    kubectl get ingress -n $NAMESPACE
    Write-Host ""

    Write-Host "PVC:" -ForegroundColor Blue
    kubectl get pvc -n $NAMESPACE
    Write-Host ""

    Print-Step "Accès à l'application:"
    Write-Host "Ajoutez cette ligne à votre fichier C:\Windows\System32\drivers\etc\hosts (admin requis):"
    Write-Host "127.0.0.1 coach-app.local" -ForegroundColor Green
    Write-Host ""
    Write-Host "Puis accédez à l'application sur: http://coach-app.local"
}

function Start-PortForward {
    Print-Step "Configuration du port forwarding..."
    Print-Warning "Ceci est utile pour le développement uniquement"

    Write-Host "Frontend: http://localhost:8080"
    Write-Host "Backend: http://localhost:8081"

    Start-Job -ScriptBlock { kubectl port-forward -n coach-app service/frontend-service 8080:80 }
    Start-Job -ScriptBlock { kubectl port-forward -n coach-app service/backend-service 8081:5000 }

    Write-Host "Port forwarding actif. Appuyez sur Ctrl+C pour arrêter."
    Get-Job | Wait-Job
}

# Menu principal
switch ($Command) {
    "build" {
        Print-Step "Mode: Construction des images"
        Build-Images
    }

    "deploy" {
        Print-Step "Mode: Déploiement complet"
        Check-K3s
        Build-Images
        Deploy-App
        Show-Status
    }

    "update" {
        Print-Step "Mode: Mise à jour"
        Check-K3s
        Update-App
        Show-Status
    }

    "clean" {
        Check-K3s
        Clean-App
    }

    "logs" {
        Check-K3s
        Show-Logs -Component $Component
    }

    "status" {
        Check-K3s
        Show-Status
    }

    "port-forward" {
        Check-K3s
        Start-PortForward
    }

    default {
        Write-Host "Script de déploiement Coach App sur K3s"
        Write-Host ""
        Write-Host "Usage: .\deploy.ps1 [COMMAND]"
        Write-Host ""
        Write-Host "Commandes:"
        Write-Host "  build          - Construire les images Docker"
        Write-Host "  deploy         - Déploiement complet (build + deploy)"
        Write-Host "  update         - Mettre à jour l'application"
        Write-Host "  clean          - Supprimer l'application"
        Write-Host "  logs [app]     - Afficher les logs (backend|frontend|mongodb)"
        Write-Host "  status         - Afficher l'état de l'application"
        Write-Host "  port-forward   - Activer le port forwarding (dev uniquement)"
        Write-Host "  help           - Afficher cette aide"
        Write-Host ""
        Write-Host "Exemples:"
        Write-Host "  .\deploy.ps1 deploy              # Déploiement complet"
        Write-Host "  .\deploy.ps1 logs backend        # Logs du backend"
        Write-Host "  .\deploy.ps1 status              # État de l'application"
    }
}
