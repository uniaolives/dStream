# dStream AI Agents - Makefile
# Updated: 21 de outubro de 2025

.PHONY: help install dev build start test lint clean db-setup db-reset docker-build docker-up docker-down seed

# Default target
help:
	@echo "dStream AI Agents - v2.0.0"
	@echo "Updated: 21 de outubro de 2025"
	@echo ""
	@echo "Available commands:"
	@echo "  install      Install dependencies"
	@echo "  dev          Start development server"
	@echo "  build        Build for production"
	@echo "  start        Start production server"
	@echo "  test         Run tests"
	@echo "  lint         Run linting"
	@echo "  clean        Clean dependencies and build files"
	@echo "  db-setup     Setup database"
	@echo "  db-reset     Reset database"
	@echo "  seed         Seed default agents"
	@echo "  docker-build Build Docker image"
	@echo "  docker-up    Start with Docker Compose"
	@echo "  docker-down  Stop Docker Compose"
	@echo "  logs         Show development logs"

# Development
install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

# Quality assurance
test:
	npm run test

lint:
	npm run lint

clean:
	rm -rf node_modules .next dist
	npm cache clean --force

# Database
db-setup:
	npm run db:push
	npm run db:generate

db-reset:
	npm run db:reset
	$(MAKE) seed

seed:
	curl -X POST http://localhost:3000/api/agents/seed

# Docker
docker-build:
	docker build -t dstream-ai-agents:2.0.0 .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# Development utilities
logs:
	tail -f dev.log

status:
	@echo "🚀 dStream AI Agents Status"
	@echo "Version: 2.0.0"
	@echo "Updated: 21 de outubro de 2025"
	@echo ""
	@echo "📊 Services:"
	@if pgrep -f "node.*server.ts" > /dev/null; then \
		echo "✅ Development server running"; \
	else \
		echo "❌ Development server stopped"; \
	fi
	@if [ -f "dev.db" ]; then \
		echo "✅ Database exists"; \
	else \
		echo "❌ Database not found"; \
	fi
	@echo ""
	@echo "🔗 URLs:"
	@echo "App: http://localhost:3000"
	@echo "API: http://localhost:3000/api"
	@echo "Agents: http://localhost:3000/ai-agents"

# Quick start
quick-start: install db-setup seed dev
	@echo "🎉 dStream AI Agents is ready!"
	@echo "Open http://localhost:3000 to get started"

# Production deployment
deploy-prod: build docker-build
	@echo "🚀 Ready for production deployment"
	@echo "Run 'make docker-up' to start production services"

# Development setup
setup-dev: install db-setup
	@echo "✅ Development environment ready"
	@echo "Run 'make dev' to start development server"