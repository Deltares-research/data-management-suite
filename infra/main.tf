# Deploy resource group
resource "azurerm_resource_group" "rg" {
  name     = "data-management-suite-${var.environment_name}"
  location = var.location
  // Tag the resource group with the azd environment name
  // This should also be applied to all resources created in this module
  tags = { azd-env-name : var.environment_name }
}