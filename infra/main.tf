locals {
  app            = "data-management-suite"
  short_app_name = "dms"
  stack_name     = "${local.app}-${var.environment_name}-${var.location}"

  default_tags = {
    environment = var.environment_name
    owner       = "Wolk"
    app         = local.app
  }
}

# Deploy resource group
resource "azurerm_resource_group" "rg" {
  name     = "rg-${local.stack_name}"
  location = var.location
  // Tag the resource group with the azd environment name
  // This should also be applied to all resources created in this module
  tags = local.default_tags
}

module "db" {
  source               = "./modules/db"
  environment_name     = var.environment_name
  resource_group_name  = azurerm_resource_group.rg.name
  location             = azurerm_resource_group.rg.location
  stack_name           = local.stack_name
  default_tags         = local.default_tags
  database_admin       = "dms_psqladmin"
  database_password    = var.database_password
  virtual_network_name = azurerm_virtual_network.vnet.name
  subnet               = azurerm_subnet.subnet1.name
}

module "web" {
  source                                 = "./modules/web"
  environment_name                       = var.environment_name
  resource_group_name                    = azurerm_resource_group.rg.name
  location                               = azurerm_resource_group.rg.location
  stack_name                             = local.stack_name
  short_app_name                         = local.short_app_name
  default_tags                           = local.default_tags
  image_name                             = "dms_remix_web"
  session_secret                         = var.session_secret
  application_insights_connection_string = module.monitoring.application_insights_conn_string
  database_connection_string             = module.db.db_connection_string
  container_app_environment_id           = module.container_app.container_app_environment_id
  container_registry_server              = module.container_app.container_registry_server
}

module "monitoring" {
  source              = "./modules/monitoring"
  environment_name    = var.environment_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  stack_name          = local.stack_name
  default_tags        = local.default_tags
}

module "container_app" {
  source                              = "./modules/container_app"
  environment_name                    = var.environment_name
  short_app_name                      = local.short_app_name
  resource_group_name                 = azurerm_resource_group.rg.name
  location                            = azurerm_resource_group.rg.location
  stack_name                          = local.stack_name
  default_tags                        = local.default_tags
  log_analytics_workspace_id          = module.monitoring.log_analytics_workspace_id
  container_app_identity_principal_id = module.web.container_app_identity_principal_id
}