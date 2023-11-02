output "AZURE_CONTAINER_REGISTRY_ENDPOINT" {
  value = module.container_app.container_registry_server
}

output "AZURE_RESOURCE_GROUP" {
  value = azurerm_resource_group.rg.name
}

output "azure_container_registry_name" {
  value = module.container_app.container_registry_name
}

output "container_app_name" {
  value = module.web.container_app_name
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "container_app_environment_name" {
  value = module.container_app.container_app_environment_name  
}

output "web_container_name" {
  value = module.web.web_container_name
}