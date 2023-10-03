output "AZURE_CONTAINER_REGISTRY_ENDPOINT" {
  value = module.container_app.container_registry_server
}

output "AZURE_RESOURCE_GROUP" {
  value = azurerm_resource_group.rg.name
}