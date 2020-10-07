#/bin/bash
cat .env.production > .env
docker-compose down
