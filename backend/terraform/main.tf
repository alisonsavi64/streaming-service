# ============================================================================
# Arquivo de exemplo de como a aplicação backend pode ser implantada
# na AWS utilizando ECS Fargate.
# ============================================================================

provider "aws" {
  region = "us-east-1"
}

# ----------------------------------------------------------------------------
# ECS Cluster
# ----------------------------------------------------------------------------
resource "aws_ecs_cluster" "backend_cluster" {
  name = "backend-cluster"
}

# ----------------------------------------------------------------------------
# ECS Task Definition
# ----------------------------------------------------------------------------
resource "aws_ecs_task_definition" "backend_task" {
  family                   = "backend-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"

  # Em um ambiente real, roles IAM seriam necessárias:
  # execution_role_arn = aws_iam_role.ecs_execution_role.arn
  # task_role_arn      = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend-app"
      image     = "meuusuario/backend:latest"
      cpu       = 256
      memory    = 512
      essential = true

      # Exemplo de variáveis de ambiente necessárias pela aplicação
      # environment = [
      #   { name = "DATABASE_URL", value = "postgres://user:pass@rds:5432/db" },
      #   { name = "JWT_SECRET", value = "example-secret" },
      #   { name = "NODE_ENV", value = "production" }
      # ]

      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
        }
      ]
    }
  ])
}

# ----------------------------------------------------------------------------
# ECS Service
# ----------------------------------------------------------------------------
resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["subnet-0123456789abcdef0"]
    security_groups = ["sg-0123456789abcdef0"]
    assign_public_ip = true
  }
}
