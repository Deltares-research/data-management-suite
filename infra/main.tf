# Deploy resource group
resource "azurerm_resource_group" "rg" {
  name     = "data-management-suite-${var.environment_name}"
  location = var.location
  // Tag the resource group with the azd environment name
  // This should also be applied to all resources created in this module
  tags = { azd-env-name : var.environment_name }
}

module "db" {
  source               = "./modules/db"
  location             = var.location
  environment_name     = var.environment_name
  database_password    = var.database_password
  resource_group       = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  subnet               = azurerm_subnet.subnet1.name
}