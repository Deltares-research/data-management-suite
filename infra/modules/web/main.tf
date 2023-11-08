terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      version = "~>3.70.0"
      source  = "hashicorp/azurerm"
    }

    azuread = {
      version = "~>2.41.0"
      source  = "hashicorp/azuread"
    }
  }
}

locals {
  container_app_name = "ca-${var.short_app_name}-${var.environment_name}-web"
  initial_container  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
  container_name     = var.container_app_already_exists ? data.azurerm_container_app.existing_container_app[0].template[0].container[0].image : local.initial_container
}

data "azurerm_container_app" "existing_container_app" {
  count               = var.container_app_already_exists ? 1 : 0
  name                = local.container_app_name
  resource_group_name = var.resource_group_name
}

data "azurerm_client_config" "current" {}

resource "azurerm_user_assigned_identity" "webapp" {
  name                = "id-${var.stack_name}-webapp"
  resource_group_name = var.resource_group_name
  location            = var.location
  tags                = var.default_tags
}

resource "azurerm_container_app" "web" {
  name                         = local.container_app_name
  container_app_environment_id = var.container_app_environment_id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"
  tags = {
    "azd-service-name" : "web"
  }
  identity {
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.webapp.id]
  }
  registry {
    server   = var.container_registry_server
    identity = azurerm_user_assigned_identity.webapp.id
  }
  ingress {
    external_enabled = true
    target_port      = 80
    transport        = "auto"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }
  template {
    min_replicas = 1
    max_replicas = 1
    container {
      name   = "web"
      image  = local.container_name
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "APPLICATIONINSIGHTS_CONNECTION_STRING"
        value = var.application_insights_connection_string
      }
      env {
        name        = "DATABASE_URL"
        secret_name = "database-url"
      }
      env {
        name        = "SESSION_SECRET"
        secret_name = "session-secret"
      }
      env {
        name  = "PORT"
        value = 80
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "AZURE_CLIENT_ID"
        value = var.app_client_id
      }
      env {
        name  = "AZURE_TENANT_ID"
        value = data.azurerm_client_config.current.tenant_id
      }
      env {
        name        = "AZURE_CLIENT_SECRET"
        secret_name = "client-secret"
      }
      env {
        name        = "PLAYWRIGHT_USER_PASSWORD"
        secret_name = "playwright-user-password"
      }
    }
  }

  secret {
    name  = "database-url"
    value = var.database_connection_string
  }

  secret {
    name  = "session-secret"
    value = var.session_secret
  }

  secret {
    name  = "client-secret"
    value = var.app_client_secret
  }

  secret {
    name  = "playwright-user-password"
    value = base64sha512(random_password.playwright_password.result)
  }
}

resource "random_password" "playwright_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-=+[]{}<>:?"
} 
