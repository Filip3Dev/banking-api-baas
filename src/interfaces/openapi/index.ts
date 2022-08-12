import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'redbenx Banking backend',
    description: 'redbenx Banking backend API',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:{port}/{basePath}',
      description: 'Local server',
      variables: {
        port: {
          enum: ['9000', '8080'],
          default: '9000',
        },
        basePath: {
          default: 'api/v1',
        },
      },
    },
  ],
}

const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ['src/api/*/use-case/*/docs.yaml', 'src/api/*/docs/*.yaml'],
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)
