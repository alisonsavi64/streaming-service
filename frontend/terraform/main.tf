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
resource "aws_ecs_cluster" "frontend_cluster" {
  name = "frontend-cluster"
}

# ----------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------
resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = "meuusuario/frontend:latest"
      essential = true
      cpu       = 256
      memory    = 512

      environment = [
        {
          name  = "NUXT_API_BASE_URL"
          value = "http://backend-service:3001"
        },
        {
          name  = "NUXT_PUBLIC_VIDEO_STREAM_HOST"
          value = "http://video-streaming-service:3003"
        },
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]

      portMappings = [
        {
          containerPort = 3000
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/frontend"
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
resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.frontend_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["subnet-0123456789abcdef0"]
    security_groups  = ["sg-0123456789abcdef0"]
    assign_public_ip = true
  }
}
