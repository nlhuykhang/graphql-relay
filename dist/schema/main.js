'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var roll = function roll() {
  return Math.floor(6 * Math.random()) + 1;
};

var queryType = new _graphql.GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      type: _graphql.GraphQLString,
      resolve: function resolve() {
        return 'world';
      }
    },
    diceRoll: {
      type: new _graphql.GraphQLList(_graphql.GraphQLInt),
      args: {
        count: {
          type: _graphql.GraphQLInt,
          defaultValue: 2
        }
      },
      resolve: function resolve(_, args) {
        var rolls = [];
        for (var i = 0; i < args.count; i++) {
          rolls.push(roll());
        }
        return rolls;
      }
    },
    usersCount: {
      type: _graphql.GraphQLInt,
      resolve: function resolve(_, args, _ref) {
        var db = _ref.db;
        return db.collection('users').count();
      }
    }
  }
});

var mySchema = new _graphql.GraphQLSchema({
  query: queryType
});

exports.default = mySchema;