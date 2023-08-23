# Input variables
variable "location" {
  description = "The supported Azure location where the resource deployed"
  type        = string
}

variable "environment_name" {
  description = "The name of the azd environment to be deployed"
  type        = string
}

variable "web_image_name" {
  description = "The image name for the web service"
  type        = string
}

variable "database_password" {
  description = "Password of the database"
  type        = string
}

variable "session_secret" {
  description = "Web session secret"
  type        = string
}