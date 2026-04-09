# Secrets Manager module
variable "environment" { type = string }

resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${var.environment}/app-secrets"
  recovery_window_in_days = 7
}

output "secret_arn" { value = aws_secretsmanager_secret.app_secrets.arn }
