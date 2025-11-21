#!/bin/bash

basedir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Use docker compose if available, otherwise docker-compose
if docker compose version > /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

function stop() {
    print_info "Stopping Blockscout services..."
    $COMPOSE_CMD -f "${basedir}"/docker-compose.yml down
    if [ $? -eq 0 ]; then
        print_info "Services stopped"
    else
        print_error "Failed to stop services"
        exit 1
    fi
}

function start() {
    # Check if .env file exists
    if [ ! -f "${basedir}"/local.env ]; then
        print_error "local.env file not found, please create configuration file first"
        exit 1
    fi

    # Check if docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running, please start Docker first"
        exit 1
    fi

    print_info "Starting Blockscout services..."
    $COMPOSE_CMD -f "${basedir}"/docker-compose.yml up -d

    print_info "Waiting for services to start..."

    # Wait for PostgreSQL
    print_info "Waiting for PostgreSQL to start..."
    for i in {1..30}; do
        if docker exec blockscout-postgres pg_isready -U blockscout > /dev/null 2>&1; then
            print_info "PostgreSQL is ready"
            break
        fi
        if [ "$i" -eq 30 ]; then
            print_error "PostgreSQL startup timeout"
            exit 1
        fi
        sleep 1
    done

    # Wait for Redis
    print_info "Waiting for Redis to start..."
    for i in {1..30}; do
        if docker exec blockscout-redis redis-cli ping > /dev/null 2>&1; then
            print_info "Redis is ready"
            break
        fi
        if [ "$i" -eq 30 ]; then
            print_error "Redis startup timeout"
            exit 1
        fi
        sleep 1
    done

    # Wait for MongoDB
    print_info "Waiting for MongoDB to start..."
    for i in {1..30}; do
        if docker exec blockscout-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
            print_info "MongoDB is ready"
            break
        fi
        if [ "$i" -eq 30 ]; then
            print_error "MongoDB startup timeout"
            exit 1
        fi
        sleep 1
    done

    # Wait for Blockscout backend
    print_info "Waiting for Blockscout backend to start (this may take a few minutes)..."
    for i in {1..120}; do
        if curl -f http://localhost:4000/api/v1/health/liveness > /dev/null 2>&1; then
            print_info "Blockscout backend is ready"
            break
        fi
        if [ "$i" -eq 120 ]; then
            print_warning "Blockscout backend startup timeout, please check logs: docker logs blockscout-backend"
        fi
        sleep 2
    done

    # Wait for Frontend
    print_info "Waiting for Frontend to start..."
    for i in {1..60}; do
        if curl -f http://localhost:3001/api/healthz > /dev/null 2>&1; then
            print_info "Frontend is ready"
            break
        fi
        if [ "$i" -eq 60 ]; then
            print_warning "Frontend startup timeout, please check logs: docker logs blockscout-frontend"
        fi
        sleep 2
    done

    echo ""
    print_info "========================================"
    print_info "All services started"
    print_info "========================================"
    echo ""
    print_info "Access URLs:"
    echo "  - Frontend: http://localhost:3001"
    echo "  - Backend API: http://localhost:4000"
    echo "  - PostgreSQL: Not exposed (container access only)"
    echo "  - MongoDB: Not exposed (container access only)"
    echo "  - Redis: Not exposed (container access only)"
    echo ""
    print_info "View logs:"
    echo "  - All services: $COMPOSE_CMD -f ${basedir}/docker-compose.yml logs -f"
    echo "  - Frontend: docker logs -f blockscout-frontend"
    echo "  - Backend: docker logs -f blockscout-backend"
    echo ""
}

function restart() {
    print_info "Restarting services (stop and restart, keep data)..."
    stop
    sleep 2
    print_info "Restarting services..."
    start
}

function reset() {
    print_warning "========================================"
    print_warning "WARNING: Reset will clear all data!"
    print_warning "========================================"
    echo ""
    print_warning "This will delete:"
    echo "  • All data in PostgreSQL database"
    echo "  • All data in Redis"
    echo "  • All data in MongoDB"
    echo "  • All synced blocks and transactions"
    echo ""
    read -p "Confirm to continue? (type 'yes' to confirm): " confirm
    if [ "$confirm" != "yes" ]; then
        print_info "Reset operation cancelled"
        exit 0
    fi

    print_info "Stopping services and deleting all data..."
    $COMPOSE_CMD -f "${basedir}"/docker-compose.yml down -v
    if [ $? -eq 0 ]; then
        print_info "Services stopped, all data cleared"
    else
        print_error "Failed to stop services"
        exit 1
    fi
    
    sleep 2
    print_info "Restarting services..."
    start
}

function status() {
    print_info "Service status:"
    $COMPOSE_CMD -f "${basedir}"/docker-compose.yml ps
    echo ""
    print_info "Health check:"
    # Check PostgreSQL
    if docker exec blockscout-postgres pg_isready -U blockscout > /dev/null 2>&1; then
        echo "  PostgreSQL: Running"
    else
        echo "  PostgreSQL: Not running or not accessible"
    fi
    
    # Check Redis
    if docker exec blockscout-redis redis-cli ping > /dev/null 2>&1; then
        echo "  Redis: Running"
    else
        echo "  Redis: Not running or not accessible"
    fi
    
    # Check MongoDB
    if docker exec blockscout-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "  MongoDB: Running"
    else
        echo "  MongoDB: Not running or not accessible"
    fi
    
    # Check Backend
    if curl -f http://localhost:4000/api/v1/health/liveness > /dev/null 2>&1; then
        echo "  Backend: Running"
    else
        echo "  Backend: Not running or not accessible"
    fi
    
    # Check Frontend
    if curl -f http://localhost:3001/api/healthz > /dev/null 2>&1; then
        echo "  Frontend: Running"
    else
        echo "  Frontend: Not running or not accessible"
    fi
}

function logs() {
    service=${2:-}
    if [ -z "$service" ]; then
        print_info "Showing all service logs (press Ctrl+C to exit)..."
        $COMPOSE_CMD -f "${basedir}"/docker-compose.yml logs -f
    else
        print_info "Showing $service service logs (press Ctrl+C to exit)..."
        $COMPOSE_CMD -f "${basedir}"/docker-compose.yml logs -f "$service"
    fi
}

cmd=$1
case ${cmd} in
init)
    print_info "===== Initialize ====="
    if [ ! -f "${basedir}"/local.env ]; then
        print_error "local.env file not found"
        print_info "Please create local.env file and configure necessary environment variables"
        exit 1
    fi
    print_info "Initialization completed"
    print_info "===== End ====="
    ;;
start)
    print_info "===== Start ====="
    start
    print_info "===== End ====="
    ;;
stop)
    print_info "===== Stop ====="
    stop
    print_info "===== End ====="
    ;;
reset)
    print_info "===== Reset ====="
    reset
    print_info "===== End ====="
    ;;
status)
    status
    ;;
logs)
    logs "$@"
    ;;
restart)
    print_info "===== Restart ====="
    restart
    print_info "===== End ====="
    ;;
*)
    echo "Usage: localup.sh {init|start|stop|restart|reset|status|logs [service]}"
    echo ""
    echo "Commands:"
    echo "  init      - Check configuration"
    echo "  start     - Start all services"
    echo "  stop      - Stop all services"
    echo "  restart   - Stop and restart all services (keep data)"
    echo "  reset     - Stop, clear all data and restart all services"
    echo "  status    - Show service status"
    echo "  logs      - Show logs (optional: specify service name)"
    echo ""
    echo "Examples:"
    echo "  ./localup.sh start"
    echo "  ./localup.sh restart"
    echo "  ./localup.sh reset"
    echo "  ./localup.sh logs frontend"
    echo "  ./localup.sh logs blockscout"
    ;;
esac

