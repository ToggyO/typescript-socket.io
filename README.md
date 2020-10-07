Typescript-socket.io
====

#### Used technologies
- [Express.js](https://expressjs.com)
- [Typescript](https://www.typescriptlang.org)
- [TypeORM](https://typeorm.io)
- [Reflect-metadata](https://github.com/rbuckton/reflect-metadata)
- [Socket.io](https://socket.io)
- [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [Winston](https://github.com/winstonjs/winston)
- [Ts-node](https://github.com/TypeStrong/ts-node)
- [Nodemon](https://nodemon.io)
- [Docker 19.03.x](https://www.docker.com)
- [Docker Compose 1.26.x](https://docs.docker.com/compose)

#### Coding style
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/docs/en/)
- [Husky](https://github.com/typicode/husky)
- [Lint-staged](https://github.com/okonet/lint-staged)

#### Required dependencies
- [Node.js](https://nodejs.org/) v.14.8.0+
- [Cloned repository](https://github.com/ToggyO/typescript-socket.io)
- Docker & Docker Compose 
to run a containerized application.

Usage
---

#####Development:
To start application in development mode, run the following commands:
1. `. start_db_dev.sh` - to create database (only before the first launch);
2. `npm run migrate:up` - to create tables and relation in database  (only before the first launch);
2. `npm install` - to install necessary packages;
3. `npm run dev` - to start application.

#####Typeorm:
- Create new entity - `npm run entity:create <ENTITY NAME>`;
- Create new subscriber - `npm run subscriber:create <SUBSCRIBER_NAME>`;
- Create new migration - `npm run migrate:create <MIGRATION_NAME>`;
- Show all migrations and whether they've been run or not - `npm run migrate:show`;
- Run migrations -`npm run migrate:up`;
- Revert migrations - `npm run migrate:down`;

Deployment
---
1. Install Docker & Docker-compose;
2. Install Git;
3. Clone repo from:
    - HTTPS - `git clone https://github.com/ToggyO/typescript-socket.io.git`
    - SSH - `git clone git@github.com:ToggyO/typescript-socket.io.git`
4. Enter source dir - `cd typescript-socket.io`;
5. On first launch run - `. start_prod.sh`;

- If you want to restart app, to apply changes, then run - `. restart_prod.sh`
    - Note: Running this script is necessary to clear physical memory from the accumulated docker images
- To stop app, run - `. stop_prod.sh`;

- To remove docker containers, run - `. remove_prod.sh`.
    - Note: Add data from database will be restored from the docker volume from 'dump' directory after a new containers will run

