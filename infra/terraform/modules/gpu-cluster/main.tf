# GPU Cluster module for ML workloads
variable "environment" { type = string }
variable "min_nodes" { type = number }
variable "max_nodes" { type = number }
variable "gpu_type" { type = string }
variable "subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }

resource "aws_ec2_launch_template" "gpu" {
  name_prefix   = "${var.environment}-gpu-"
  image_id      = data.aws_ami.gpu_ami.id
  instance_type = var.gpu_type

  vpc_security_group_ids = var.security_group_ids
  iam_instance_profile {
    arn = aws_iam_instance_profile.gpu.arn
  }

  user_data = base64encode(file("${path.module}/user_data.sh"))

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "gpu" {
  name                = "${var.environment}-gpu-asg"
  min_size            = var.min_nodes
  max_size            = var.max_nodes
  desired_capacity    = var.min_nodes
  vpc_zone_identifier = var.subnet_ids
  launch_template {
    id      = aws_ec2_launch_template.gpu.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${var.environment}-gpu-node"
    propagate_at_launch = true
  }
}

data "aws_ami" "gpu_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["Deep Learning AMI GPU *"]
  }
}

resource "aws_iam_role" "gpu_node" {
  name = "${var.environment}-gpu-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_instance_profile" "gpu" {
  name = "${var.environment}-gpu-instance-profile"
  role = aws_iam_role.gpu_node.name
}

output "endpoint" { value = aws_autoscaling_group.gpu.name }
output "asg_name" { value = aws_autoscaling_group.gpu.name }
