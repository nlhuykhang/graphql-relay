'use strict';

var _graphql = require('graphql');

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongodb = require('mongodb');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _main = require('./schema/main.js');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MONGO_URL = 'mongodb://localhost:27017/test';

// import readline from 'readline';

var app = (0, _express2.default)();

// const rli = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

_mongodb.MongoClient.connect(MONGO_URL, function (err, db) {
  _assert2.default.equal(null, err);
  console.log('Connected to MongoDB server');

  // rli.question('Client request:', inputQuery => {
  //   ql(mySchema, inputQuery, {}, { db }).then(result => {
  //     console.log('Server answer: ', result.data);
  //     db.close(() => rli.close());
  //   });
  //
  //   rli.close();
  // });

  app.use('/graphql', (0, _expressGraphql2.default)({
    schema: _main2.default,
    context: { db: db }
  }));

  app.listen(4000, function () {
    return console.log('Running express graphql on port 4000.');
  });
});