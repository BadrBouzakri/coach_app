#!/bin/bash

# Script to create Sealed Secrets for Coach App
# Usage: ./create-sealed-secret.sh [environment]
# Example: ./create-sealed-secret.sh production

set -e

ENVIRONMENT=${1:-production}
NAMESPACE="coach-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Coach App Sealed Secrets Creator ===${NC}"
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "Namespace: ${YELLOW}$NAMESPACE${NC}"
echo ""

# Check if kubeseal is installed
if ! command -v kubeseal &> /dev/null; then
    echo -e "${RED}Error: kubeseal is not installed${NC}"
    echo "Install it with:"
    echo "  wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/kubeseal-0.24.0-linux-amd64.tar.gz"
    echo "  tar xfz kubeseal-0.24.0-linux-amd64.tar.gz"
    echo "  sudo install -m 755 kubeseal /usr/local/bin/kubeseal"
    exit 1
fi

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}Error: kubectl is not configured or cluster is not accessible${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Prerequisites checked"
echo ""

# Fetch the public key from the cluster
echo -e "${YELLOW}Fetching Sealed Secrets public key from cluster...${NC}"
kubeseal --fetch-cert \
  --controller-name=sealed-secrets-controller \
  --controller-namespace=kube-system \
  > /tmp/pub-sealed-secrets-${ENVIRONMENT}.pem

if [ ! -f /tmp/pub-sealed-secrets-${ENVIRONMENT}.pem ]; then
    echo -e "${RED}Error: Failed to fetch public key${NC}"
    echo "Make sure Sealed Secrets controller is installed:"
    echo "  kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml"
    exit 1
fi

echo -e "${GREEN}✓${NC} Public key fetched"
echo ""

# Prompt for MongoDB credentials
echo -e "${YELLOW}=== MongoDB Secrets ===${NC}"
read -p "MongoDB Username (default: admin): " MONGODB_USER
MONGODB_USER=${MONGODB_USER:-admin}

read -sp "MongoDB Password: " MONGODB_PASS
echo ""

if [ -z "$MONGODB_PASS" ]; then
    echo -e "${RED}Error: MongoDB password cannot be empty${NC}"
    exit 1
fi

# Prompt for Backend secrets
echo -e "${YELLOW}=== Backend Secrets ===${NC}"
read -sp "JWT Secret (leave empty to generate): " JWT_SECRET
echo ""

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated JWT Secret${NC}"
fi

# Create MongoDB URI
MONGODB_URI="mongodb://${MONGODB_USER}:${MONGODB_PASS}@mongodb-service:27017/coach_app?authSource=admin"

# Create temporary secret YAML files
echo -e "${YELLOW}Creating temporary secret files...${NC}"

cat <<EOF > /tmp/mongodb-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
  namespace: $NAMESPACE
type: Opaque
stringData:
  username: $MONGODB_USER
  password: $MONGODB_PASS
EOF

cat <<EOF > /tmp/backend-secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
  namespace: $NAMESPACE
type: Opaque
stringData:
  jwt-secret: $JWT_SECRET
  mongodb-uri: $MONGODB_URI
EOF

echo -e "${GREEN}✓${NC} Temporary secrets created"
echo ""

# Seal the secrets
echo -e "${YELLOW}Sealing secrets...${NC}"

kubeseal --format=yaml --cert=/tmp/pub-sealed-secrets-${ENVIRONMENT}.pem \
  < /tmp/mongodb-secret.yaml \
  > /tmp/sealed-mongodb-secret.yaml

kubeseal --format=yaml --cert=/tmp/pub-sealed-secrets-${ENVIRONMENT}.pem \
  < /tmp/backend-secret.yaml \
  > /tmp/sealed-backend-secret.yaml

echo -e "${GREEN}✓${NC} Secrets sealed"
echo ""

# Combine sealed secrets
OUTPUT_FILE="environments/${ENVIRONMENT}/sealed-secrets.yaml"

cat <<EOF > $OUTPUT_FILE
# PRODUCTION SEALED SECRETS - Generated $(date)
# Environment: $ENVIRONMENT
# DO NOT EDIT MANUALLY - Regenerate using ./scripts/create-sealed-secret.sh

EOF

cat /tmp/sealed-mongodb-secret.yaml >> $OUTPUT_FILE
echo "---" >> $OUTPUT_FILE
cat /tmp/sealed-backend-secret.yaml >> $OUTPUT_FILE

echo -e "${GREEN}✓${NC} Sealed secrets written to: ${YELLOW}$OUTPUT_FILE${NC}"
echo ""

# Cleanup
echo -e "${YELLOW}Cleaning up temporary files...${NC}"
rm -f /tmp/mongodb-secret.yaml /tmp/backend-secret.yaml
rm -f /tmp/sealed-mongodb-secret.yaml /tmp/sealed-backend-secret.yaml
rm -f /tmp/pub-sealed-secrets-${ENVIRONMENT}.pem

echo -e "${GREEN}✓${NC} Cleanup complete"
echo ""

echo -e "${GREEN}=== SUCCESS ===${NC}"
echo -e "Sealed secrets created for ${YELLOW}$ENVIRONMENT${NC} environment"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the file: $OUTPUT_FILE"
echo "2. Commit to Git: git add $OUTPUT_FILE && git commit -m 'Add sealed secrets for $ENVIRONMENT'"
echo "3. Push to repository: git push"
echo "4. ArgoCD will automatically sync the secrets"
echo ""
echo -e "${RED}IMPORTANT:${NC} The original unencrypted secrets are NOT saved anywhere"
echo "Make sure to store them securely (e.g., password manager) for future reference"
