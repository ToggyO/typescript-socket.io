/*
 * Description: TypeORM configuration file
 */

import config from './src/config';

const isProd = config.NODE_ENV === 'production';
const pathPrefix = isProd ? 'dist/' : '';

module.exports = {
  host: config.POSTGRES_HOST,
  type: 'postgres',
  port: isProd ? config.POSTGRES_PORT : config.POSTGRES_EXTERNAL_PORT,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DATABASE,
  entities: [`${pathPrefix}src/db/entities/**{.ts,.js}`],
  migrations: [`${pathPrefix}src/db/migrations/**{.ts,.js}`],
  cli: {
    entitiesDir: `${pathPrefix}src/db/entities`,
    migrationsDir: `${pathPrefix}src/db/migrations`,
    subscribersDir: `${pathPrefix}src/db/subscribers`,
  },
  // entities: [`${pathPrefix}src/db/entities/**{.ts,.js}`],
  // migrations: [`${pathPrefix}src/db/migrations/**{.ts,.js}`],
  // cli: {
  //   entitiesDir: `${pathPrefix}src/db/entities`,
  //   migrationsDir: `${pathPrefix}src/db/migrations`,
  //   subscribersDir: `${pathPrefix}src/db/subscribers`,
  // },
  synchronize: false,
  logging: true,
};

// module.exports = {
//   host: config.POSTGRES_HOST,
//   type: 'postgres',
//   port: isProd ? config.POSTGRES_PORT : config.POSTGRES_EXTERNAL_PORT,
//   username: config.POSTGRES_USER,
//   password: config.POSTGRES_PASSWORD,
//   database: config.POSTGRES_DATABASE,
//   entities: ['src/db/entities/**{.ts,.js}'],
//   migrations: ['src/db/migrations/**{.ts,.js}'],
//   cli: {
//     entitiesDir: 'src/db/entities',
//     migrationsDir: 'src/db/migrations',
//     subscribersDir: 'src/db/subscribers',
//   },
//   synchronize: false,
//   logging: true,
// };

// const {
//   NODE_ENV,
//   POSTGRES_HOST,
//   POSTGRES_PORT,
//   POSTGRES_EXTERNAL_PORT,
//   POSTGRES_USER,
//   POSTGRES_PASSWORD,
//   POSTGRES_DATABASE,
// } = process.env;

// const isProd = NODE_ENV === 'production';
// const pathPrefix = isProd ? '../dist/' : '';
// console.log(isProd);
// console.log(POSTGRES_HOST);
// console.log(POSTGRES_PORT);
// console.log(POSTGRES_EXTERNAL_PORT);
// console.log(POSTGRES_USER);
// console.log(POSTGRES_PASSWORD);
// console.log(POSTGRES_DATABASE);
// module.exports = {
//   host: POSTGRES_HOST,
//   type: 'postgres',
//   port: isProd ? POSTGRES_PORT : POSTGRES_EXTERNAL_PORT,
//   username: POSTGRES_USER,
//   password: POSTGRES_PASSWORD,
//   database: POSTGRES_DATABASE,
//   entities: [`${pathPrefix}src/db/entities/**{.ts,.js}`],
//   migrations: [`${pathPrefix}src/db/migrations/**{.ts,.js}`],
//   cli: {
//     entitiesDir: `${pathPrefix}src/db/entities`,
//     migrationsDir: `${pathPrefix}src/db/migrations`,
//     subscribersDir: `${pathPrefix}src/db/subscribers`,
//   },
//   synchronize: false,
//   logging: true,
// };
