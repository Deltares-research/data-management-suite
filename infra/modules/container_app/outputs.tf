output "container_registry_server" {
  value = azurerm_container_registry.acr.login_server
}

output "container_app_environment_id" {
  value = azurerm_container_app_environment.env.id
}