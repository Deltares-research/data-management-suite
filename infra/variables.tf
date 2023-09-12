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
  sensitive   = true
}

variable "session_secret" {
  description = "Web session secret"
  type        = string
  sensitive   = true
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

variable "web_app_exists" {
  description = "Web app already exists and we should not change the running image"
  type        = bool
}