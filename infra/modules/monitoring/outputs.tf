output "application_insights_conn_string" {
  description = "Connection string to connect to application insights."
  value       = azurerm_application_insights.appi.connection_string
}

output "application_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = azurerm_application_insights.appi.instrumentation_key
}

output "application_insights_name" {
  value = azurerm_application_insights.appi.name
}

output "log_analytics_workspace_id" {
  value = azurerm_log_analytics_workspace.log.id
}