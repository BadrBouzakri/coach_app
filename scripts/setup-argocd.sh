#!/bin/bash

# ArgoCD Setup Script for Coach App
# This script installs and configures ArgoCD on your Kubernetes cluster

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Coach App - ArgoCD Setup Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}✗ kubectl not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} kubectl installed"

if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}✗ Cannot connect to cluster${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Cluster accessible"

echo ""

# Install ArgoCD
echo -e "${YELLOW}Installing ArgoCD...${NC}"

kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo -e "${GREEN}✓${NC} ArgoCD installed"
echo ""

# Wait for ArgoCD to be ready
echo -e "${YELLOW}Waiting for ArgoCD to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s \
  deployment/argocd-server -n argocd

echo -e "${GREEN}✓${NC} ArgoCD is ready"
echo ""

# Install Sealed Secrets Controller
echo -e "${YELLOW}Installing Sealed Secrets Controller...${NC}"

kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml

echo -e "${GREEN}✓${NC} Sealed Secrets Controller installed"
echo ""

# Get ArgoCD initial password
echo -e "${YELLOW}Retrieving ArgoCD admin password...${NC}"
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

echo -e "${GREEN}✓${NC} Password retrieved"
echo ""

# Apply Coach App project
echo -e "${YELLOW}Creating Coach App project...${NC}"
kubectl apply -f argocd/projects/coach-app-project.yaml

echo -e "${GREEN}✓${NC} Project created"
echo ""

# Prompt for environment to deploy
echo -e "${YELLOW}Which environment would you like to deploy?${NC}"
echo "1) Preprod only"
echo "2) Production only"
echo "3) Both"
read -p "Choose (1-3): " ENV_CHOICE

case $ENV_CHOICE in
  1)
    kubectl apply -f argocd/applications/coach-app-preprod.yaml
    echo -e "${GREEN}✓${NC} Preprod application created"
    ;;
  2)
    kubectl apply -f argocd/applications/coach-app-production.yaml
    echo -e "${GREEN}✓${NC} Production application created"
    ;;
  3)
    kubectl apply -f argocd/applications/coach-app-preprod.yaml
    kubectl apply -f argocd/applications/coach-app-production.yaml
    echo -e "${GREEN}✓${NC} Both applications created"
    ;;
  *)
    echo -e "${RED}Invalid choice${NC}"
    exit 1
    ;;
esac

echo ""

# Provide access instructions
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Setup Complete! 🎉            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}ArgoCD Admin Credentials:${NC}"
echo -e "  Username: ${BLUE}admin${NC}"
echo -e "  Password: ${BLUE}$ARGOCD_PASSWORD${NC}"
echo ""
echo -e "${YELLOW}Access ArgoCD UI:${NC}"
echo ""
echo -e "1. Port-forward ArgoCD server:"
echo -e "   ${BLUE}kubectl port-forward svc/argocd-server -n argocd 8080:443${NC}"
echo ""
echo -e "2. Open in browser:"
echo -e "   ${BLUE}https://localhost:8080${NC}"
echo ""
echo -e "3. Login with credentials above"
echo ""
echo -e "${YELLOW}Install ArgoCD CLI (optional):${NC}"
echo -e "   ${BLUE}curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64${NC}"
echo -e "   ${BLUE}sudo install -m 555 argocd /usr/local/bin/argocd${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure GitLab repository access (if private)"
echo "2. Configure image pull secrets for GitLab registry"
echo "3. Create sealed secrets using: ./scripts/create-sealed-secret.sh"
echo "4. Commit and push to trigger ArgoCD sync"
echo ""
echo -e "${RED}IMPORTANT:${NC} Save the admin password securely!"
echo ""
