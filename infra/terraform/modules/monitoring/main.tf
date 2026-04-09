# CloudWatch Monitoring module
variable "environment" { type = string }
variable "cluster_id" { type = string }
variable "alert_email" { type = string; default = "" }

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.cluster_id}"
  retention_in_days = 30

  tags = {
    Name = "${var.environment}-ecs-logs"
  }
}

resource "aws_cloudwatch_metric_alarm" "cpu_utilization" {
  alarm_name          = "${var.cluster_id}-high-cpu"
  alarm_description   = "Alert when CPU exceeds 80%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 80
  treat_missing_data  = "notBreaching"

  dimensions = {
    ClusterName = var.cluster_id
  }
}

resource "aws_cloudwatch_metric_alarm" "memory_utilization" {
  alarm_name          = "${var.cluster_id}-high-memory"
  alarm_description   = "Alert when memory exceeds 85%"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 300
  statistic           = "Average"
  threshold           = 85
  treat_missing_data  = "notBreaching"

  dimensions = {
    ClusterName = var.cluster_id
  }
}

output "log_group_name" { value = aws_cloudwatch_log_group.ecs.name }
