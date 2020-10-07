#/bin/bash
cat .env.production > .env
docker-compose up -d --build
