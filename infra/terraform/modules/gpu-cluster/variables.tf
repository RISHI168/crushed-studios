variable "environment" { type = string }
variable "min_nodes" { type = number }
variable "max_nodes" { type = number }
variable "gpu_type" { type = string }
variable "subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }
