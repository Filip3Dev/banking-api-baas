const path = require('path')

const ENVS = {
  DEV: 'development',
  TEST: 'test',
}

const rootDir = [ENVS.DEV, ENVS.TEST].includes(process.env.NODE_ENV) ? 'src' : 'dist/src'

if (process.env.NODE_ENV != ENVS.TEST) {
  require(path.join('src', 'config', 'env'))
}

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: process.env.DEBUG === 'true',
    entities: [path.join(rootDir, 'api/*/model/*.{js,ts}'), path.join(rootDir, 'interfaces/*/entities/*.{js,ts}')],
    migrations: [path.join(rootDir, 'config/database/migrations/*.{js,ts}')],
    cli: {
      migrationsDir: path.join(rootDir, 'config/database/migrations'),
    },
  },
  {
    name: 'test',
    type: 'postgres',
    url: process.env.DATABASE_URL,
    dropSchema: true,
    logging: false,
    synchronize: false,
    migrationsRun: true,
    entities: [path.join(rootDir, 'api/*/model/*.{js,ts}'), path.join(rootDir, 'interfaces/*/entities/*.{js,ts}')],
    migrations: [path.join(rootDir, 'config/database/migrations/*.{js,ts}')],
    cli: {
      migrationsDir: path.join(rootDir, 'config/database/migrations'),
    },
  },
]
