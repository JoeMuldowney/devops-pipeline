terraform {
    backend "s3" {
        bucket = "devops-directive-tf-state-jmuldo"
        key = "tf-infa/terraform.tfstate"
        region = "us-east-2"
        encrypt = true
    }
    required_providers{
        aws = {
            source = "hashicorp/aws"
            version = "~> 6.2.0"
        }
    }
}

provider "aws" {
    region = "us-east-2"
}

# Create the bucket
resource "aws_s3_bucket" "terraform_state" {
  bucket        = "devops-directive-tf-state-jmuldo"
  force_destroy = true
}

# Enable versioning
resource "aws_s3_bucket_versioning" "terraform_state_versioning" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state_sse" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
