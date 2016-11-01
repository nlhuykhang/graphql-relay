import {
  graphql as ql,
} from 'graphql';

import qlHttp from 'express-graphql';
import express from 'express';

import { MongoClient as mgClient } from 'mongodb';

import assert from 'assert';

const MONGO_URL = 'mongodb://localhost:27017/test';

import mySchema from './schema/main.js';

const app = express();

mgClient.connect(MONGO_URL, (err, db) => {
  assert.equal(null, err);
  console.log('Connected to MongoDB server');

  app.use('/graphql', qlHttp({
    schema: mySchema,
    context: { db },
    graphiql: true,
  }));

  app.listen(4000, () => console.log('Running express graphql on port 4000.'));

});
