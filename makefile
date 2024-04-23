docker_run:
	sudo docker run -p 3001:3000 --env-file ./.env ghcr.io/blockscout/frontend:latest
docker_build:
	sudo docker-compose up --build