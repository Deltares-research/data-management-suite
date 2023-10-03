terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      version = "~>3.70.0"
      source  = "hashicorp/azurerm"
    }
  }
}

resource "azurerm_postgresql_flexible_server" "db_server" {
  name                   = "sql-${var.stack_name}"
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "15"
  delegated_subnet_id    = var.subnet.id
  private_dns_zone_id    = var.private_dns_zone.id
  administrator_login    = var.database_admin
  administrator_password = var.database_password
  zone                   = "1"

  storage_mb = 32768

  sku_name = "B_Standard_B1ms"
  tags     = var.default_tags
}

resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = "psql-${var.stack_name}"
  server_id = azurerm_postgresql_flexible_server.db_server.id
}

resource "azurerm_postgresql_flexible_server_configuration" "ext" {
  name      = "azure.extensions"
  server_id = azurerm_postgresql_flexible_server.db_server.id
  value     = "POSTGIS"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "whitelist_azure" {
  name             = "whitelist_azure"
  server_id        = azurerm_postgresql_flexible_server.db_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "whitelist_all" {
  name             = "whitelist_all"
  server_id        = azurerm_postgresql_flexible_server.db_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}