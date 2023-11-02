output "container_app_identity_principal_id" {
  value = azurerm_user_assigned_identity.webapp.principal_id
}

output "container_app_name" {
  value = azurerm_container_app.web.name
}

output "web_container_name" {
  value = local.container_name
}