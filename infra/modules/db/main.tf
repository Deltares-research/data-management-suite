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

resource "azurerm_postgresql_flexible_server" "db_server" {
  name                   = "dms-psqlflexibleserver-${var.environment_name}"
  resource_group_name    = data.azurerm_resource_group.rg.name
  location               = data.azurerm_resource_group.rg.location
  version                = "15"
  administrator_login    = var.database_admin
  administrator_password = var.database_password
  zone                   = "1"

  storage_mb = 32768

  sku_name = "B_Standard_B1ms"
}

resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = "dms"
  server_id = azurerm_postgresql_flexible_server.db_server.id
}

resource "azurerm_postgresql_flexible_server_configuration" "ext" {
  name      = "azure.extensions"
  server_id = azurerm_postgresql_flexible_server.db_server.id
  value     = "POSTGIS"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "whitelist_all" {
  name             = "whitelist_all"
  server_id        = azurerm_postgresql_flexible_server.db_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
