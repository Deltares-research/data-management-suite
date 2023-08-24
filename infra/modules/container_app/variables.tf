variable "environment_name" {
  description = "The name of the azd environment to be deployed"
  type        = string
}

variable "resource_group" {
  description = "Name of the resource group the database should be placed in"
  type        = string
}

variable "stack_name" {
  description = "Name of the stack being deployed, consisting of app name, env and location"
}

variable "log_analytics_workspace_name" {
  description = "Connection string to connect to database"
  type        = string
}

variable "container_app_identity_principal_id" {
  description = "System managed identity of the container app"
}

variable "container_app_name" {
  description = "name of the container app"
}