# ============================================================================
# Infraestrutura do Video Processor usando ECS + Fargate
# Serviço responsável por processamento assíncrono de vídeos
# ============================================================================

provider "aws" {
  region = "us-east-1"
}

# ----------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------
resource "aws_ecs_cluster" "video_processor_cluster" {
  name = "video-processor-cluster"
}

# ----------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------
resource "aws_ecs_task_definition" "video_processor_task" {
  family                   = "video-processor-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"

  # IAM roles seriam necessários em produção
  # execution_role_arn = aws_iam_role.ecs_execution_role.arn
  # task_role_arn      = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "video-processor"
      image     = "meuusuario/video-processor:latest"
      cpu       = 512
      memory    = 1024
      essential = true

      environment = [
        {
          name  = "KAFKA_BROKER"
          value = "b-1.msk-cluster.amazonaws.com:9092"
        },
        {
          name  = "PORT"
          value = "4001"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/video-processor"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

# ----------------------------------------------------------------------------
# ECS Service
# ----------------------------------------------------------------------------
resource "aws_ecs_service" "video_processor_service" {
  name            = "video-processor-service"
  cluster         = aws_ecs_cluster.video_processor_cluster.id
  task_definition = aws_ecs_task_definition.video_processor_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["subnet-0123456789abcdef0"]
    security_groups  = ["sg-0123456789abcdef0"]
    assign_public_ip = true
  }
}
