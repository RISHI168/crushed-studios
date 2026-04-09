# ECS Cluster module
variable "environment" { type = string }
variable "cluster_name" { type = string }
variable "min_size" { type = number }
variable "max_size" { type = number }
variable "desired_capacity" { type = number }
variable "instance_type" { type = string }
variable "subnet_ids" { type = list(string) }
variable "security_group_ids" { type = list(string) }

resource "aws_ecs_cluster" "main" {
  name = var.cluster_name
}

resource "aws_autoscaling_group" "main" {
  name            = "${var.cluster_name}-asg"
  min_size        = var.min_size
  max_size        = var.max_size
  desired_capacity = var.desired_capacity
  vpc_zone_identifier = var.subnet_ids
  launch_configuration = aws_launch_configuration.main.id

  tag {
    key                 = "Name"
    value               = "${var.cluster_name}-instance"
    propagate_at_launch = true
  }
}

resource "aws_launch_configuration" "main" {
  image_id      = data.aws_ami.ecs_ami.id
  instance_type = var.instance_type
  security_groups = var.security_group_ids

  iam_instance_profile = aws_iam_instance_profile.ecs.name

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    cluster_name = var.cluster_name
  }))

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb" "main" {
  name            = "${var.cluster_name}-alb"
  internal        = false
  load_balancer_type = "application"
  security_groups = var.security_group_ids
  subnets         = var.subnet_ids

  enable_deletion_protection = false

  tags = {
    Name = "${var.cluster_name}-alb"
  }
}

data "aws_ami" "ecs_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*"]
  }
}

resource "aws_iam_instance_profile" "ecs" {
  name = "${var.environment}-ecs-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_iam_role" "ecs_instance_role" {
  name = "${var.environment}-ecs-instance-role"

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

resource "aws_iam_role_policy_attachment" "ecs_instance_role" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

output "cluster_id" { value = aws_ecs_cluster.main.id }
output "alb_dns_name" { value = aws_lb.main.dns_name }
output "alb_arn" { value = aws_lb.main.arn }
