terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      version = "~>3.70.0"
      source  = "hashicorp/azurerm"
    }
  }
}

resource "azurerm_user_assigned_identity" "webapp" {
  name                = "id-${var.stack_name}-webapp"
  resource_group_name = var.resource_group_name
  location            = var.location
  tags                = var.default_tags
}


resource "azurerm_container_app" "web" {
  name                         = "ca-${var.short_app_name}-${var.environment_name}-web"
  container_app_environment_id = var.container_app_environment_id
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"
  tags                         = var.default_tags
  identity {
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.webapp.id]
  }
  registry {
    server   = var.container_registry_server
    identity = azurerm_user_assigned_identity.webapp.id
  }
  template {
    container {
      name   = "remix-main"
      image  = "${var.container_registry_server}/${var.image_name}:latest"
      cpu    = 0.5
      memory = "1Gi"


      env {
        name  = "APPLICATIONINSIGHTS_CONNECTION_STRING"
        value = var.application_insights_connection_string
      }
      env {
        name  = "DATABASE_URL"
        value = var.database_connection_string
      }
      env {
        name  = "SESSION_SECRET"
        value = var.session_secret
      }
      env {
        name  = "PORT"
        value = 80
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }
}