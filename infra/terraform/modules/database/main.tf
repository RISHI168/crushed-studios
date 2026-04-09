# RDS Database module
variable "environment" {
  type = string
}

variable "db_name" {
  type = string
}

variable "instance_class" {
  type = string
}

variable "allocated_storage" {
  type = number
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_ids" {
  type = list(string)
}

variable "multi_az" {
  type    = bool
  default = false
}

resource "aws_db_subnet_group" "main" {
  subnet_ids = var.subnet_ids

  tags = {
    Name = "${var.environment}-db-subnet-group"
  }
}

resource "aws_db_instance" "main" {
  identifier           = "${var.environment}-db"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = var.instance_class
  allocated_storage    = var.allocated_storage
  db_name              = replace(var.db_name, "-", "_")
  username             = "admin"
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = var.security_group_ids
  multi_az             = var.multi_az
  backup_retention_period = 30
  skip_final_snapshot  = false
  final_snapshot_identifier = "${var.environment}-db-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  tags = {
    Name = "${var.environment}-db"
  }
}

output "endpoint" {
  value = aws_db_instance.main.endpoint
}

output "address" {
  value = aws_db_instance.main.address
}

output "port" {
  value = aws_db_instance.main.port
}
