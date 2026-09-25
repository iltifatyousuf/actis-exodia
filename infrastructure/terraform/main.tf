terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. Secure VPC for Exodia Stack
resource "aws_vpc" "exodia_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "exodia-secure-vpc"
  }
}

# 2. Kubernetes Cluster (EKS)
module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "20.0.0"
  cluster_name    = "exodia-prod-cluster"
  cluster_version = "1.30"
  vpc_id          = aws_vpc.exodia_vpc.id
  subnet_ids      = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  # Dedicated Node Groups for Kafka and AI Workloads
  eks_managed_node_groups = {
    kafka_nodes = {
      instance_types = ["m5.2xlarge"]
      min_size       = 3
      max_size       = 5
    }
    ai_inference_nodes = {
      instance_types = ["g5.xlarge"] # GPU nodes for local Llama3
      min_size       = 1
      max_size       = 3
    }
  }
}
