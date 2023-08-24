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

data "azurerm_log_analytics_workspace" "log" {
  name                = var.log_analytics_workspace_name
  resource_group_name = var.resource_group
}

data "azurerm_container_app" "ca" {
  name                = var.container_app_name
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_container_app_environment" "env" {
  name                       = "cae-${var.stack_name}"
  location                   = data.azurerm_resource_group.rg.location
  resource_group_name        = data.azurerm_resource_group.rg.name
  log_analytics_workspace_id = data.azurerm_log_analytics_workspace.log.id
  tags                       = var.default_tags
}

resource "azurerm_container_registry" "acr" {
  name                = "cr-${var.stack_name}"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = false
  tags                = var.default_tags
}

resource "azurerm_role_assignment" "acrpull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "acrpull"
  principal_id         = var.container_app_identity_principal_id
  depends_on = [
    data.azurerm_container_app.ca
  ]
}