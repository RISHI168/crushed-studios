# CloudFront CDN module
variable "environment" { type = string }
variable "s3_bucket_domain" { type = string }
variable "domain_name" { type = string }
variable "enable_waf" { type = bool; default = false }

resource "aws_cloudfront_distribution" "main" {
  enabled = true

  origin {
    domain_name = var.s3_bucket_domain
    origin_id   = "s3-origin"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "${var.environment}-cdn"
  }
}

output "cloudfront_domain_name" { value = aws_cloudfront_distribution.main.domain_name }
output "cloudfront_distribution_id" { value = aws_cloudfront_distribution.main.id }
