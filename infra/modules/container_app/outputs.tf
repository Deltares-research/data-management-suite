output "container_registry_server" {
  value = azurerm_container_registry.acr.login_server
}

output "container_registry_name" {
  value = azurerm_container_registry.acr.name
}

output "container_app_environment_id" {
  value = azurerm_container_app_environment.env.id
}

output "container_app_environment_name" {
  value = azurerm_container_app_environment.env.name
}
