terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      version = "~>3.70.0"
      source  = "hashicorp/azurerm"
    }
  }
}

data "azurerm_resource_group" "rg" {
  name = var.resource_group
}

data "azurerm_container_app_environment" "cae" {
  name                = var.container_app_environment_name
  resource_group_name = data.azurerm_resource_group.rg.name
}

data "azurerm_container_registry" "cr" {
  name                = var.container_registry_name
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_user_assigned_identity" "webapp" {
  name                = "id-${var.stack_name}-webapp"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  tags                = var.default_tags
}


resource "azurerm_container_app" "web" {
  name                         = "ca-${var.stack_name}-web"
  container_app_environment_id = data.azurerm_container_app_environment.cae.id
  resource_group_name          = data.azurerm_resource_group.rg.name
  revision_mode                = "Single"
  tags                         = var.default_tags
  identity {
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.webapp.id]
  }
  registry {
    server   = data.azurerm_container_registry.cr.login_server
    identity = azurerm_user_assigned_identity.webapp.id
  }
  template {
    container {
      name   = "remix-main"
      image  = "${data.azurerm_container_registry.cr.login_server}/${var.image_name}:latest"
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