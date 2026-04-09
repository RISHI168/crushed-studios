variable "environment" { type = string }
variable "db_name" { type = string }
variable "instance_class" { type = string }
variable "allocated_storage" { type = number }
variable "subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }
variable "multi_az" { type = bool; default = false }
