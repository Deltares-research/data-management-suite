output "db_connection_string" {
  # Use 6432 port to connect via PgBouncer
  value = "postrgresql://${var.database_admin}:${var.database_password}@${azurerm.azurerm_postgresql_flexible_server.fqdn}:6432/${azurerm_postgresql_flexible_server_database.db.name}"
}