import { DataSource } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      let datasource;
      if (process.env.NODE_ENV === 'local') {
        datasource = {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '12345678',
          database: 'next_contab',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      } else if (process.env.NODE_ENV === 'develop') {
        datasource = {
          type: 'mysql',
          port: 3306,
          host: process.env.TYPEORM_HOST,
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          database: process.env.TYPEORM_DATABASE,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: true,
        };
      } else {
        datasource = {
          type: 'mysql',
          port: 3306,
          host: process.env.TYPEORM_HOST,
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          database: process.env.TYPEORM_DATABASE,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
          extra: { socketPath: `/cloudsql/${process.env.TYPEORM_CLOUDSQL}` },
        };
      }
      console.log(datasource)
      const dataSource = new DataSource(datasource);

      return dataSource.initialize();
    },
  },
];
