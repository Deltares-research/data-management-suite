terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      version = "~>3.70.0"
      source  = "hashicorp/azurerm"
    }
  }
}

resource "azurerm_container_app_environment" "env" {
  name                       = "cae-${var.stack_name}"
  resource_group_name        = var.resource_group_name
  location                   = var.location
  log_analytics_workspace_id = var.log_analytics_workspace_id
  tags                       = var.default_tags
  infrastructure_subnet_id   = var.subnet.id
}

resource "azurerm_container_registry" "acr" {
  name                = "cr${var.short_app_name}${var.environment_name}${var.location}"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false
  tags                = var.default_tags
}

resource "azurerm_role_assignment" "acrpull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "acrpull"
  principal_id         = var.container_app_identity_principal_id
}