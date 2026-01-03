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

  container_definitions = jsonencode([
    {
      name      = "backend-app"
      image     = "meuusuario/backend:latest"
      essential = true
      cpu       = 256
      memory    = 512

      environment = [
        # -------------------------------------------------------
        # App
        # -------------------------------------------------------
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = "3001" },

        # -------------------------------------------------------
        # Auth / Security
        # -------------------------------------------------------
        { name = "JWT_SECRET", value = "example-jwt-secret" },
        { name = "COOKIE_SECRET", value = "example-cookie-secret" },

        # -------------------------------------------------------
        # Database (RDS)
        # -------------------------------------------------------
        {
          name  = "DATABASE_URL"
          value = "postgres://streaming:streaming@rds-backend.amazonaws.com:5432/streaming"
        },
        { name = "DATABASE_HOST", value = "rds-backend.amazonaws.com" },
        { name = "DATABASE_PORT", value = "5432" },
        { name = "DATABASE_USER", value = "streaming" },
        { name = "DATABASE_PASSWORD", value = "streaming" },
        { name = "DATABASE_NAME", value = "streaming" },

        # -------------------------------------------------------
        # Kafka (MSK)
        # -------------------------------------------------------
        {
          name  = "KAFKA_BROKER"
          value = "b-1.msk-cluster.amazonaws.com:9092"
        },

        # -------------------------------------------------------
        # Tracing
        # -------------------------------------------------------
        {
          name  = "JAEGER_ENDPOINT"
          value = "http://jaeger-collector.example:14268/api/traces"
        },

        # -------------------------------------------------------
        # Public URLs (NO localhost)
        # -------------------------------------------------------
        {
          name  = "API_BASE_URL"
          value = "https://api.example.com"
        },
        {
          name  = "THUMBNAIL_BASE_URL"
          value = "https://cdn.video-streaming.example"
        },

        # -------------------------------------------------------
        # CORS
        # -------------------------------------------------------
        {
          name  = "CORS_ORIGINS"
          value = "https://frontend.example.com"
        }
      ]

      portMappings = [
        {
          containerPort = 3001
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/backend"
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
