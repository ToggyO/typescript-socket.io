#/bin/bash
cat .env.development > .env
docker-compose -f docker-compose.dev.yml down