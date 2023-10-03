variable "environment_name" {
  description = "The name of the azd environment to be deployed"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group the database should be placed in"
  type        = string
}

variable "location" {
  description = "Azure region the resources should be deployed in"
  type        = string
}

variable "stack_name" {
  description = "Name of the stack being deployed, consisting of app name, env and location"
  type        = string
}

variable "short_app_name" {
  description = "Short alphanumeric string to describe the app"
  type        = string
}

variable "default_tags" {
  description = "Default tags to add to all resources"
  type        = map(string)
}

variable "log_analytics_workspace_id" {
  description = "Id of log analytics workspace"
  type        = string
}

variable "container_app_identity_principal_id" {
  description = "System managed identity of the container app"
  type        = string
}

variable "subnet" {
  description = "Subnet to place the database in"
  type = object({
    name = string
    id   = string
  })
}