# ============================================================================
# Arquivo de esboço/exemplo de como a aplicação pode ser implantada
# na AWS utilizando ECS Fargate.
# ============================================================================

provider "aws" {
  region = "us-east-1"
}

# ----------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------
resource "aws_ecs_cluster" "video_streaming_cluster" {
  name = "video-streaming-cluster"
}

# ----------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------
resource "aws_ecs_task_definition" "video_streaming_task" {
  family                   = "video-streaming-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"

  container_definitions = jsonencode([
    {
      name      = "video-streaming-app"
      image     = "meuusuario/video-streaming:latest"
      essential = true
      cpu       = 512
      memory    = 1024

      environment = [
        { name = "STORAGE_HOST", value = "https://d123abcd.cloudfront.net" },
        { name = "PORT", value = "3003" }
      ]

      portMappings = [
        {
          containerPort = 3003
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/video-streaming"
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
resource "aws_ecs_service" "video_streaming_service" {
  name            = "video-streaming-service"
  cluster         = aws_ecs_cluster.video_streaming_cluster.id
  task_definition = aws_ecs_task_definition.video_streaming_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["subnet-0123456789abcdef0"]
    security_groups  = ["sg-0123456789abcdef0"]
    assign_public_ip = true
  }
}
