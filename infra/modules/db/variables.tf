
variable "location" {
  description = "The supported Azure location where the resource deployed"
  type        = string
}

variable "environment_name" {
  description = "The name of the azd environment to be deployed"
  type        = string
}

variable "stack_name" {
  description = "Name of the stack being deployed, consisting of app name, env and location"
}

variable "database_admin" {
  description = "Database admin username"
  type        = string
}

variable "database_password" {
  description = "Password of the database"
  type        = string
}

variable "resource_group" {
  description = "Name of the resource group the database should be placed in"
  type        = string
}

variable "virtual_network_name" {
  description = "Name of virtual network to place the database in"
  type        = string
}

variable "subnet" {
  description = "Name of subnet to place the database in"
  type        = string
}