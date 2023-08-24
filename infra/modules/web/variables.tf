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
  type        = string
}

variable default_tags {
  description = "Default tags to add to all resources"
  type        = map(string)
}

variable "image_name" {
  description = "name of the web service image"
  type        = string
}

variable "session_secret" {
  description = "Session secret to use by the web app"
  type        = string
}

variable "database_connection_string" {
  description = "Connection string to connect to database"
  type        = string
}

variable "application_insights_connection_string" {
  description = "connection string to send logs to application insights"
  type        = string
}

variable "container_app_environment_name" {
  description = "Name of the container app environment"
  type        = string
}

variable "container_registry_name" {
  description = "Name of container Azure container registry the container is located"
  type        = string
}