output "db_connection_string" {
  # Use 6432 port to connect via PgBouncer
  value = "postgresql://${var.database_admin}:${var.database_password}@${azurerm_postgresql_flexible_server.db_server.fqdn}:5432/${azurerm_postgresql_flexible_server_database.db.name}"
}