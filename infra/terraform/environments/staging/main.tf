# Staging environment infrastructure
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "crushed-studios-terraform-state"
    key            = "staging/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "staging"
      Project     = "crushed-studios"
      Terraform   = "true"
    }
  }
}

# VPC and networking
module "networking" {
  source = "../../modules/networking"

  environment = "staging"
  vpc_cidr    = "10.0.0.0/16"
  az_count    = 2
}

# Database
module "database" {
  source = "../../modules/database"

  environment     = "staging"
  db_name         = "crushed_studios_staging"
  instance_class  = "db.t3.medium"
  allocated_storage = 20
  subnet_ids      = module.networking.private_subnet_ids
  security_group_ids = [module.networking.db_security_group_id]
}

# Compute
module "compute" {
  source = "../../modules/compute"

  environment     = "staging"
  cluster_name    = "crushed-studios-staging"
  min_size        = 1
  max_size        = 3
  desired_capacity = 2
  instance_type   = "t3.medium"
  subnet_ids      = module.networking.private_subnet_ids
  security_group_ids = [module.networking.alb_security_group_id]
}

# Storage
module "storage" {
  source = "../../modules/storage"

  environment = "staging"
  bucket_name = "crushed-studios-staging-assets"
}

# CDN
module "cdn" {
  source = "../../modules/cdn"

  environment      = "staging"
  s3_bucket_domain = module.storage.bucket_domain
  domain_name      = "staging.crushed.studio"
}

# Monitoring
module "monitoring" {
  source = "../../modules/monitoring"

  environment = "staging"
  cluster_id  = module.compute.cluster_id
}

# Secrets
module "secrets" {
  source = "../../modules/secrets"

  environment = "staging"
}

output "alb_dns_name" {
  value = module.compute.alb_dns_name
}

output "database_endpoint" {
  value = module.database.endpoint
}

output "s3_bucket_name" {
  value = module.storage.bucket_name
}

output "cloudfront_domain_name" {
  value = module.cdn.cloudfront_domain_name
}
