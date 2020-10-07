#/bin/bash
cat .env.production > .env
docker-compose down
docker rmi $(docker images -f "dangling=true" -q)
docker-compose up -d --build
