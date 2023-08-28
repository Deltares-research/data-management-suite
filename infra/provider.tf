# Configure the Azure Provider
terraform {
  required_version = ">= 1.1.7, < 2.0.0"
  required_providers {
    azurerm = {
      version = "~>3.70.0"
      source  = "hashicorp/azurerm"
    }

    azuread = {
      version = "~>2.41.0"
      source  = "hashicorp/azuread"
    }
  }
  backend "azurerm" {
  }
}

provider "azurerm" {
  features {
  }
}

provider "azuread" {
}