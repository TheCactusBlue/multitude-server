import {createConnection, useContainer} from "typeorm";

import * as entities from './entities'
import {Container} from "typedi";

export async function connectDatabase() {
  useContainer(Container);
  return await createConnection({
    type: 'postgres',
    entities: Object.values(entities),
    url: process.env.SQL,
    // migrationsRun: true,
  })
}