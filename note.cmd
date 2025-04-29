docker compose down
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

docker compose -f docker-compose.dev.yml exec app npm run test
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name <name>