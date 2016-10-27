import {
  graphql as ql,
} from 'graphql';

import qlHttp from 'express-graphql';
import express from 'express';

import { MongoClient as mgClient } from 'mongodb';

import assert from 'assert';

const MONGO_URL = 'mongodb://localhost:27017/test';

// import readline from 'readline';

import mySchema from './schema/main.js';

const app = express();

// const rli = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

mgClient.connect(MONGO_URL, (err, db) => {
  assert.equal(null, err);
  console.log('Connected to MongoDB server');

  // rli.question('Client request:', inputQuery => {
  //   ql(mySchema, inputQuery, {}, { db }).then(result => {
  //     console.log('Server answer: ', result.data);
  //     db.close(() => rli.close());
  //   });
  //
  //   rli.close();
  // });

  app.use('/graphql', qlHttp({
    schema: mySchema,
    context: { db },
  }));

  app.listen(4000, () => console.log('Running express graphql on port 4000.'));

});
