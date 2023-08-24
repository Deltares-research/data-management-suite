terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      version = "~>3.70.0"
      source  = "hashicorp/azurerm"
    }
  }
}

resource "azurerm_log_analytics_workspace" "log" {
  name                = "log-${var.stack_name}"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = var.default_tags
}

resource "azurerm_application_insights" "appi" {
  name                = "appi-${var.stack_name}"
  resource_group_name = var.resource_group_name
  location            = var.location
  workspace_id        = azurerm_log_analytics_workspace.log.id
  application_type    = "web"
  tags                = var.default_tags
}