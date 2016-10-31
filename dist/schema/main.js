'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var roll = function roll() {
  return Math.floor(6 * Math.random()) + 1;
};

var toTitleCase = function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var readLastLinePromise = function readLastLinePromise(path) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(path, function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      resolve(data.toString().trim().split('\n').slice(-1)[0]);
    });
  });
};

var appendLinePromise = function appendLinePromise(path, line) {
  return new Promise(function (resolve, reject) {
    _fs2.default.appendFile(path, line, function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(line);
    });
  });
};

var mutationType = new _graphql.GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addQoute: {
      type: _graphql.GraphQLString,
      args: {
        body: {
          type: _graphql.GraphQLString
        }
      },
      resolve: function resolve(_, args) {
        return appendLinePromise('data/quotes', args.body);
      }
    }
  }
});

var LetterCaseType = new _graphql.GraphQLEnumType({
  name: 'LetterCase',
  values: {
    TITLE: {
      value: 'title'
    },
    UPPER: {
      value: 'upper'
    },
    LOWER: {
      value: 'lower'
    }
  }
});

var EmployeeType = new _graphql.GraphQLObjectType({
  name: 'Employee',
  fields: function fields() {
    return {
      name: {
        type: _graphql.GraphQLString,
        args: {
          upperCase: {
            type: _graphql.GraphQLBoolean
          }
        },
        resolve: function resolve(obj, args) {
          var fullName = obj.firstName + ' ' + obj.lastName;

          return args.upperCase ? fullName.toUpperCase() : fullName;
        }
      },
      nameForCase: {
        type: _graphql.GraphQLString,
        args: {
          letterCase: {
            type: LetterCaseType
          }
        },
        resolve: function resolve(obj, args) {
          var fullName = obj.firstName + ' ' + obj.lastName;
          switch (args.letterCase) {
            case 'lower':
              return fullName.toLowerCase();
            case 'upper':
              return fullName.toUpperCase();
            case 'title':
              return toTitleCase(fullName);
            default:
              return fullName;
          }
        }
      },
      boss: {
        type: EmployeeType
      }
    };
  }
});

var queryType = new _graphql.GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    lastQuote: {
      type: _graphql.GraphQLString,
      resolve: function resolve() {
        return readLastLinePromise('data/quotes');
      }
    },
    hello: {
      type: _graphql.GraphQLString,
      resolve: function resolve() {
        return 'world';
      }
    },
    diceRoll: {
      type: new _graphql.GraphQLList(_graphql.GraphQLInt),
      description: '**Simulate** a dice roll determined by count',
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
      description: 'Total number of users in the database',
      resolve: function resolve(_, args, _ref) {
        var db = _ref.db;
        return db.collection('users').count();
      }
    },
    exampleEmployee: {
      type: EmployeeType,
      args: {
        test: {
          type: _graphql.GraphQLInt
        }
      },
      resolve: function resolve() {
        return { firstName: 'khang', lastName: 'nguyen-le' };
      }
    }
  }
});

var mySchema = new _graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
});

exports.default = mySchema;