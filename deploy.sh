#!/bin/bash

# Enhanced deployment script for Coach App with multi-environment support
# Usage: ./deploy.sh [environment] [action]
# Example: ./deploy.sh local deploy
#          ./deploy.sh production build

set -e

ENVIRONMENT=${1:-local}
ACTION=${2:-deploy}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Coach App Deployment Script          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "Action: ${YELLOW}$ACTION${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(local|preprod|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment '$ENVIRONMENT'${NC}"
    echo "Valid environments: local, preprod, production"
    exit 1
fi

# Validate action
if [[ ! "$ACTION" =~ ^(build|deploy|delete|status|logs)$ ]]; then
    echo -e "${RED}Error: Invalid action '$ACTION'${NC}"
    echo "Valid actions: build, deploy, delete, status, logs"
    exit 1
fi

# Check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}✗ kubectl not found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} kubectl"
    
    if ! command -v kustomize &> /dev/null; then
        echo -e "${YELLOW}! kustomize not found, installing...${NC}"
        curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
        sudo mv kustomize /usr/local/bin/
    fi
    echo -e "${GREEN}✓${NC} kustomize"
    
    if [ "$ENVIRONMENT" != "local" ]; then
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}✗ docker not found${NC}"
            exit 1
        fi
        echo -e "${GREEN}✓${NC} docker"
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${RED}✗ Cannot connect to cluster${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓${NC} cluster connection"
    
    echo ""
}

# Build Docker images
build_images() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    
    if [ "$ENVIRONMENT" = "local" ]; then
        # Build with docker-compose for local
        docker-compose build
        
        # Tag for k8s
        docker tag coach_app-frontend:latest coach-app-frontend:latest
        docker tag coach_app-backend:latest coach-app-backend:latest
        
        echo -e "${GREEN}✓${NC} Local images built and tagged"
    else
        # Build and push to registry
        REGISTRY="registry.gitlab.com/bouzakri.badr/coach_app"
        TAG="${CI_COMMIT_SHORT_SHA:-$(git rev-parse --short HEAD)}"
        
        echo -e "${YELLOW}Building frontend...${NC}"
        docker build -t "$REGISTRY/frontend:$TAG" -t "$REGISTRY/frontend:latest" ./frontend
        
        echo -e "${YELLOW}Building backend...${NC}"
        docker build -t "$REGISTRY/backend:$TAG" -t "$REGISTRY/backend:latest" ./backend
        
        echo -e "${YELLOW}Pushing to registry...${NC}"
        docker push "$REGISTRY/frontend:$TAG"
        docker push "$REGISTRY/frontend:latest"
        docker push "$REGISTRY/backend:$TAG"
        docker push "$REGISTRY/backend:latest"
        
        echo -e "${GREEN}✓${NC} Images built and pushed to registry"
    fi
    
    echo ""
}

# Deploy to Kubernetes
deploy() {
    echo -e "${YELLOW}Deploying to $ENVIRONMENT...${NC}"
    
    # Apply kustomization
    kustomize build "environments/$ENVIRONMENT" | kubectl apply -f -
    
    echo -e "${GREEN}✓${NC} Resources created/updated"
    echo ""
    
    # Wait for rollout
    echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"
    kubectl rollout status deployment/mongodb -n coach-app --timeout=300s
    kubectl rollout status deployment/backend -n coach-app --timeout=300s
    kubectl rollout status deployment/frontend -n coach-app --timeout=300s
    
    echo -e "${GREEN}✓${NC} All deployments ready"
    echo ""
}

# Delete resources
delete() {
    echo -e "${RED}Deleting resources from $ENVIRONMENT...${NC}"
    read -p "Are you sure? (yes/no): " CONFIRM
    
    if [ "$CONFIRM" != "yes" ]; then
        echo "Cancelled"
        exit 0
    fi
    
    kustomize build "environments/$ENVIRONMENT" | kubectl delete -f -
    echo -e "${GREEN}✓${NC} Resources deleted"
    echo ""
}

# Show status
status() {
    echo -e "${YELLOW}Status for $ENVIRONMENT:${NC}"
    echo ""
    
    echo -e "${BLUE}Pods:${NC}"
    kubectl get pods -n coach-app
    echo ""
    
    echo -e "${BLUE}Services:${NC}"
    kubectl get svc -n coach-app
    echo ""
    
    if [ "$ENVIRONMENT" = "production" ]; then
        echo -e "${BLUE}HPA:${NC}"
        kubectl get hpa -n coach-app
        echo ""
    fi
    
    if [ "$ENVIRONMENT" != "production" ]; then
        echo -e "${BLUE}Ingress:${NC}"
        kubectl get ingress -n coach-app
        echo ""
    fi
}

# Show logs
logs() {
    echo -e "${YELLOW}Recent logs for $ENVIRONMENT:${NC}"
    echo ""
    
    read -p "Component (mongodb/backend/frontend): " COMPONENT
    
    kubectl logs -l "app=$COMPONENT" -n coach-app --tail=50 --follow
}

# Main execution
case $ACTION in
    build)
        check_prerequisites
        build_images
        ;;
    deploy)
        check_prerequisites
        build_images
        deploy
        status
        ;;
    delete)
        check_prerequisites
        delete
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
esac

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Action Complete! 🚀          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"

# Show access info
if [ "$ACTION" = "deploy" ]; then
    echo ""
    echo -e "${YELLOW}Access your application:${NC}"
    
    if [ "$ENVIRONMENT" = "local" ]; then
        echo -e "  Add to /etc/hosts: ${BLUE}127.0.0.1 coach-app.local${NC}"
        echo -e "  URL: ${BLUE}http://coach-app.local${NC}"
    elif [ "$ENVIRONMENT" = "preprod" ]; then
        echo -e "  Add to /etc/hosts: ${BLUE}127.0.0.1 preprod.coach-app.local${NC}"
        echo -e "  URL: ${BLUE}http://preprod.coach-app.local${NC}"
    elif [ "$ENVIRONMENT" = "production" ]; then
        echo -e "  Frontend NodePort: ${BLUE}30080${NC}"
        echo -e "  Backend NodePort: ${BLUE}30500${NC}"
        echo -e "  Configure Apache proxy to point to these ports"
    fi
    echo ""
fi
