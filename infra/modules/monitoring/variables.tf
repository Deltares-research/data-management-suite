variable "environment_name" {
  description = "The name of the azd environment to be deployed"
  type        = string
}

variable "stack_name" {
  description = "Name of the stack being deployed, consisting of app name, env and location"
}

variable "resource_group" {
  description = "Name of the resource group the database should be placed in"
  type        = string
}

variable "default_tags" {
  description = "Default tags to add to all resources"
  type        = map(string)
}