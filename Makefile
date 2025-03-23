DOCKER_COMPOSE = docker-compose -f courier-backend/docker-compose-infra.yml
KAFKA_CONTAINER = $(shell docker ps --format "{{.Names}}" | grep kafka)
ZOOKEEPER_CONTAINER = $(shell docker ps --format "{{.Names}}" | grep zookeeper)
REDIS_CONTAINER = $(shell docker ps --format "{{.Names}}" | grep redis)

DISCOVERY_SERVICE = courier-backend/discovery-service
API_GATEWAY = courier-backend/api-gateway
MICROSERVICES = courier-backend/auth-service courier-backend/error-service courier-backend/resource-service courier-backend/user-service
PROJECT_ROOT = $(shell pwd)

SERVICE ?=

.PHONY: start-microservice

start-infra:
	@echo "Starting Kafka, Zookeeper and Redis"
	$(DOCKER_COMPOSE) up -d
	@echo "Waiting for infrastructure service to be ready"
	sleep 10

stop-infra:
	@echo "Stopping Kafka, Zookeeper and Redis"
	$(DOCKER_COMPOSE) down

logs-kafka:
	@echo "Showing Kafka logs"
	docker logs -f $(KAFKA_CONTAINER)

logs-redis:
	@echo "Showing Redis logs"
	docker logs -f $(REDIS_CONTAINER)

redis-cli:
	@echo "Connecting to Redis CLI"
	docker exec -it $(REDIS_CONTAINER) redis-cli

list-kafka-topics:
	@echo "Listing Kafka topics"
	docker exec -it $(KAFKA_CONTAINER) kafka-topics --list --bootstrap-server kafka:9092

create-kafka-topic:
	@echo "Creating Kafka topic"
	docker exec -it $(KAFKA_CONTAINER) kafka-topics --create --topic $(TOPIC) --partitions 1 --replication-factor 1 --bootstrap-server kafka:9092

delete-kafka-topic:
	@echo "Deleting Kafka topic"
	docker exec -it $(KAFKA_CONTAINER) kafka-topics --delete --topic $(TOPIC) --bootstrap-server kafka:9092

status:
	@docker ps --format "table {{.Names}}\t{{.State}}\t{{.Ports}}"

restart-infra: stop-infra start-infra

start-discovery:
	@echo "Starting Discovery Service"
	(cd $(PROJECT_ROOT)/$(DISCOVERY_SERVICE) && mvn spring-boot:run &)
	@echo "Waiting for Discovery Service to register in Eureka"
	sleep 10

start-api-gateway: 
	@echo "Starting API Gateway"
	(cd $(PROJECT_ROOT)/$(API_GATEWAY) && mvn spring-boot:run &)
	@echo "Waiting for API Gateway to be available"
	sleep 5

start-microservice:
	@if [ -z "$(SERVICE)" ]; then \
		echo "Please provide a service to start. Example: make start-microservice SERVICE=auth-service"; \
		exit 1; \
	fi
	cd $(PROJECT_ROOT)/courier-backend/$(SERVICE) && mvn spring-boot:run


start-microservices:
	@echo "Starting microservices"
	@for microservice in $(MICROSERVICES); do \
		echo "Starting $$microservice"; \
		(cd $(PROJECT_ROOT)/$$microservice && mvn spring-boot:run &) \
	done


stop-microservice:
	@echo "Stopping microservice: $(SERVICE)"
	@cd $(PROJECT_ROOT)/courier-backend/$(SERVICE) && mvn spring-boot:stop || echo "$(SERVICE) not running"
	@echo "Checking if $(SERVICE) is still running..."
	@PID=$$(lsof -ti :$(PORT)) && [ -n "$$PID" ] && kill -9 $$PID && echo "Killed process on port $(PORT)" || echo "No process found on port $(PORT)"


stop-microservices:
	@echo "Stopping all microservices..."
	@for microservice in $(DISCOVERY_SERVICE) $(API_GATEWAY) $(MICROSERVICES); do \
		echo "Stopping $$microservice..."; \
		(cd $(PROJECT_ROOT)/$$microservice && mvn spring-boot:stop || echo "$$microservice not running"); \
	done
	@echo "Verifying remaining running services..."
	@for port in 8761 8080 8081 8082 8083 8084; do \
		PID=$$(lsof -ti :$$port); \
		if [ -n "$$PID" ]; then \
			echo "Force killing process on port $$port (PID: $$PID)..."; \
			kill -9 $$PID; \
		else \
			echo "No process found on port $$port"; \
		fi; \
	done
	@echo "All microservices stopped."

restart-microservices: stop-microservices start-microservices

start-all: start-infra start-discovery start-api-gateway start-microservices

stop-all: stop-microservices stop-infra
