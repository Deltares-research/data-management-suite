variable "environment_name" {
  description = "The name of the azd environment to be deployed"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group the database should be placed in"
  type        = string
}

variable "container_app_already_exists" {
  description = "Bool stating whether the container app should already exists, so we dont change the used image during infra deploy"
  type        = bool
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

variable "container_app_environment_id" {
  description = "Id of the container app environment to place the container app in"
  type        = string
}

variable "container_registry_server" {
  description = "location of the container registry"
  type        = string
}

variable "session_secret" {
  description = "Session secret to use by the web app"
  type        = string
}

variable "app_client_id" {
  description = "client id of the app registration used by the webapp"
  type        = string
}

variable "app_client_secret" {
  description = "client secret of the app registration used by the webapp"
  type        = string
  sensitive   = true
}

variable "database_connection_string" {
  description = "Connection string to connect to database"
  type        = string
}

variable "application_insights_connection_string" {
  description = "connection string to send logs to application insights"
  type        = string
}