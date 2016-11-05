const { MongoClient } = require('mongodb');
const assert = require('assert');
const graphqlHTTP = require('express-graphql');
const express = require('express');
const fs = require('fs');
const path = require('path');

const {
  introspectionQuery: introQuery,
} = require('graphql/utilities');

const {
  graphql: ql,
} = require('graphql');


const app = express();
const mySchema = require('./schema/main');
const MONGO_URL = 'mongodb://localhost:27017/test';

app.use(express.static('public'));

MongoClient.connect(MONGO_URL, (err, db) => {
  assert.equal(null, err);
  console.log('Connected to MongoDB server');

  app.use('/ql', graphqlHTTP({
    schema: mySchema,
    context: { db },
    graphiql: true
  }));

  ql(mySchema, introQuery)
  .then(re => {
    fs.writeFileSync(
      path.join(__dirname, 'cache/schema.json'),
      JSON.stringify(re, null, 2)
    );
  })
  .catch(console.error);

  app.listen(3000, () =>
    console.log('Running Express.js on port 3000')
  );
});
