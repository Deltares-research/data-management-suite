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
}

variable "default_tags" {
  description = "Default tags to add to all resources"
  type        = map(string)
}

variable "database_admin" {
  description = "Database admin username"
  type        = string
}

variable "database_password" {
  description = "Password of the database"
  type        = string
}

variable "subnet" {
  description = "Subnet to place the database in"
  type = object({
    name = string
    id   = string
  })
}

variable "private_dns_zone" {
  description = "Private DNS Zone linking to the database"
  type = object({
    name = string
    id   = string
  })
}