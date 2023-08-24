output "container_registry_name" {
  value = azurerm_container_registry.acr.name
}

output "container_app_environment_name" {
  value = azurerm_container_app_environment.env.name
}