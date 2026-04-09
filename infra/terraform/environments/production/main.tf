# Production environment infrastructure
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
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = "production"
      Project     = "crushed-studios"
      Terraform   = "true"
    }
  }
}

# VPC and networking
module "networking" {
  source = "../../modules/networking"

  environment = "production"
  vpc_cidr    = "10.1.0.0/16"
  az_count    = 3
}

# Database
module "database" {
  source = "../../modules/database"

  environment      = "production"
  db_name          = "crushed_studios_production"
  instance_class   = "db.r6i.xlarge"
  allocated_storage = 100
  multi_az         = true
  subnet_ids       = module.networking.private_subnet_ids
  security_group_ids = [module.networking.db_security_group_id]
}

# Compute
module "compute" {
  source = "../../modules/compute"

  environment      = "production"
  cluster_name     = "crushed-studios-production"
  min_size         = 3
  max_size         = 10
  desired_capacity = 5
  instance_type    = "c6i.xlarge"
  subnet_ids       = module.networking.private_subnet_ids
  security_group_ids = [module.networking.alb_security_group_id]
}

# Storage
module "storage" {
  source = "../../modules/storage"

  environment    = "production"
  bucket_name    = "crushed-studios-production-assets"
  versioning     = true
  encryption     = true
  replication    = true
}

# CDN
module "cdn" {
  source = "../../modules/cdn"

  environment      = "production"
  s3_bucket_domain = module.storage.bucket_domain
  domain_name      = "crushed.studio"
  enable_waf       = true
}

# Monitoring
module "monitoring" {
  source = "../../modules/monitoring"

  environment = "production"
  cluster_id  = module.compute.cluster_id
  alert_email = "ops@crushed.studio"
}

# GPU Cluster
module "gpu_cluster" {
  source = "../../modules/gpu-cluster"

  environment      = "production"
  min_nodes        = 1
  max_nodes        = 5
  gpu_type         = "g4dn.xlarge"
  subnet_ids       = module.networking.private_subnet_ids
  security_group_ids = [module.networking.alb_security_group_id]
}

# Secrets
module "secrets" {
  source = "../../modules/secrets"

  environment = "production"
}

output "alb_dns_name" {
  value = module.compute.alb_dns_name
}

output "database_endpoint" {
  value     = module.database.endpoint
  sensitive = true
}

output "s3_bucket_name" {
  value = module.storage.bucket_name
}

output "cloudfront_domain_name" {
  value = module.cdn.cloudfront_domain_name
}

output "gpu_cluster_endpoint" {
  value = module.gpu_cluster.endpoint
}
