#!/bin/bash

# =============================================================================
# Azure Container Apps Deployment Script
# Usage: ./deploy.sh <environment>
# Example: ./deploy.sh hackathon
#          ./deploy.sh personal
# =============================================================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# -----------------------------------------------------------------------------
# Helper Functions
# -----------------------------------------------------------------------------

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

usage() {
    echo "Usage: $0 <environment>"
    echo ""
    echo "Environments:"
    echo "  hackathon  - Deploy to hackathon Azure account"
    echo "  personal   - Deploy to personal Azure account"
    echo ""
    echo "Prerequisites:"
    echo "  1. Azure CLI installed and logged in to the correct account"
    echo "  2. Config file exists: scripts/azure-config-<environment>.env"
    echo ""
    echo "Example:"
    echo "  az login  # Login to your Azure account first"
    echo "  $0 hackathon"
    exit 1
}

# -----------------------------------------------------------------------------
# Main Script
# -----------------------------------------------------------------------------

# Check if environment argument is provided
if [ -z "$1" ]; then
    log_error "Environment argument is required"
    usage
fi

ENVIRONMENT=$1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="$SCRIPT_DIR/azure-config-${ENVIRONMENT}.env"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    log_error "Config file not found: $CONFIG_FILE"
    exit 1
fi

# Load configuration
log_info "Loading configuration from $CONFIG_FILE"
source "$CONFIG_FILE"

# Validate required variables
REQUIRED_VARS=("RESOURCE_GROUP" "LOCATION" "ACR_NAME" "CONTAINER_APP_ENV" "CONTAINER_APP_NAME" "IMAGE_NAME")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        log_error "Required variable $var is not set in $CONFIG_FILE"
        exit 1
    fi
done

# Display configuration
echo ""
echo "=============================================="
echo "Deployment Configuration: $ENVIRONMENT"
echo "=============================================="
echo "Resource Group:      $RESOURCE_GROUP"
echo "Location:            $LOCATION"
echo "ACR Name:            $ACR_NAME"
echo "Container App Env:   $CONTAINER_APP_ENV"
echo "Container App Name:  $CONTAINER_APP_NAME"
echo "Image Name:          $IMAGE_NAME"
echo "=============================================="
echo ""

# Confirm deployment
read -p "Do you want to proceed with this deployment? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warn "Deployment cancelled"
    exit 0
fi

# -----------------------------------------------------------------------------
# Step 1: Verify Azure CLI login
# -----------------------------------------------------------------------------
log_info "Verifying Azure CLI login..."
ACCOUNT_INFO=$(az account show --query "{name:name, id:id}" -o tsv 2>/dev/null) || {
    log_error "Not logged in to Azure CLI. Please run 'az login' first."
    exit 1
}
log_info "Logged in to Azure account: $ACCOUNT_INFO"

# -----------------------------------------------------------------------------
# Step 2: Create Resource Group (if not exists)
# -----------------------------------------------------------------------------
log_info "Creating resource group '$RESOURCE_GROUP' in '$LOCATION'..."
az group create \
    --name "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --output none

# -----------------------------------------------------------------------------
# Step 3: Create Azure Container Registry (if not exists)
# -----------------------------------------------------------------------------
log_info "Creating Azure Container Registry '$ACR_NAME'..."
az acr create \
    --resource-group "$RESOURCE_GROUP" \
    --name "$ACR_NAME" \
    --sku Basic \
    --admin-enabled true \
    --output none 2>/dev/null || log_info "ACR already exists, continuing..."

# Get ACR credentials
log_info "Retrieving ACR credentials..."
ACR_LOGIN_SERVER=$(az acr show --name "$ACR_NAME" --query loginServer -o tsv)
ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query "passwords[0].value" -o tsv)

# -----------------------------------------------------------------------------
# Step 4: Build and Push Docker Image
# -----------------------------------------------------------------------------
log_info "Building and pushing Docker image to ACR..."
cd "$PROJECT_DIR"

# Use ACR build (builds in the cloud, no local Docker needed)
# Note: Using --no-logs to avoid Windows encoding issues with Unicode characters
# The build runs in Azure and we check the result via the JSON output
log_info "Starting ACR build (logs suppressed to avoid Windows encoding issues)..."
BUILD_RESULT=$(az acr build \
    --registry "$ACR_NAME" \
    --image "$IMAGE_NAME:latest" \
    --image "$IMAGE_NAME:$(date +%Y%m%d-%H%M%S)" \
    . \
    --no-logs \
    --query "status" -o tsv)

if [ "$BUILD_RESULT" != "Succeeded" ]; then
    log_error "ACR build failed with status: $BUILD_RESULT"
    log_error "Check build logs with: az acr task logs -r $ACR_NAME"
    exit 1
fi

FULL_IMAGE_NAME="$ACR_LOGIN_SERVER/$IMAGE_NAME:latest"
log_info "Image built and pushed successfully: $FULL_IMAGE_NAME"

# -----------------------------------------------------------------------------
# Step 5: Create Container Apps Environment (if not exists)
# -----------------------------------------------------------------------------
log_info "Creating Container Apps environment '$CONTAINER_APP_ENV'..."
az containerapp env create \
    --name "$CONTAINER_APP_ENV" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --output none 2>/dev/null || log_info "Container Apps environment already exists, continuing..."

# -----------------------------------------------------------------------------
# Step 6: Deploy Container App
# -----------------------------------------------------------------------------
log_info "Deploying Container App '$CONTAINER_APP_NAME'..."

# Check if container app exists
if az containerapp show --name "$CONTAINER_APP_NAME" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
    # Update existing container app
    log_info "Updating existing Container App..."
    az containerapp update \
        --name "$CONTAINER_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --image "$FULL_IMAGE_NAME" \
        --output none
else
    # Create new container app
    log_info "Creating new Container App..."

    # Build environment variables string if defined
    ENV_VARS_ARG=""
    if [ -n "$ENV_VARS" ]; then
        ENV_VARS_ARG="--env-vars $ENV_VARS"
    fi

    az containerapp create \
        --name "$CONTAINER_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --environment "$CONTAINER_APP_ENV" \
        --image "$FULL_IMAGE_NAME" \
        --registry-server "$ACR_LOGIN_SERVER" \
        --registry-username "$ACR_USERNAME" \
        --registry-password "$ACR_PASSWORD" \
        --target-port 3000 \
        --ingress external \
        --cpu 0.5 \
        --memory 1.0Gi \
        --min-replicas 0 \
        --max-replicas 3 \
        $ENV_VARS_ARG \
        --output none
fi

# -----------------------------------------------------------------------------
# Step 7: Get Application URL
# -----------------------------------------------------------------------------
log_info "Retrieving application URL..."
APP_URL=$(az containerapp show \
    --name "$CONTAINER_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "properties.configuration.ingress.fqdn" \
    -o tsv)

# -----------------------------------------------------------------------------
# Deployment Complete
# -----------------------------------------------------------------------------
echo ""
echo "=============================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=============================================="
echo "Environment:    $ENVIRONMENT"
echo "Application URL: https://$APP_URL"
echo ""
echo "Useful commands:"
echo "  View logs:    az containerapp logs show -n $CONTAINER_APP_NAME -g $RESOURCE_GROUP --follow"
echo "  View app:     az containerapp show -n $CONTAINER_APP_NAME -g $RESOURCE_GROUP"
echo "  Update env:   az containerapp update -n $CONTAINER_APP_NAME -g $RESOURCE_GROUP --set-env-vars KEY=VALUE"
echo "=============================================="
