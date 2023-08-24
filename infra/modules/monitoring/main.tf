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

resource "azurerm_log_analytics_workspace" "log" {
  name                = "log-${var.stack_name}"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  sku                 = var.environment_name == "dev" ? "Free" : "PerGB2018"
  retention_in_days   = 30
  tags                = var.default_tags
}

resource "azurerm_application_insights" "appi" {
  name                = "appi-${var.stack_name}"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.log.id
  application_type    = "web"
  tags                = var.default_tags
}