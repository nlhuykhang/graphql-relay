const {
  GraphQLSchema: qlSchema,
  GraphQLObjectType: qlObjectType,
  GraphQLString: qlString,
  GraphQLInt: qlInt,
  GraphQLList: qlList,
  GraphQLBoolean: qlBoolean,
  GraphQLEnumType: qlEnumType,
} = require('graphql');

const {
  connectionDefinitions: cDef,
  connectionArgs: cArgs,
  connectionFromArray: cFromArray,
  connectionFromPromisedArray: cFromPromiseArray,
} = require('graphql-relay');

const QuoteType = new qlObjectType({
  name: 'Quote',
  fields: {
    id: {
      type: qlString,
      resolve: obj => obj._id,
    },
    text: {
      type: qlString,
    },
    author: {
      type: qlString,
    },
  },
});

const { connectionType: QuotesConnectionType } = cDef({
  name: 'Quote',
  nodeType: QuoteType,
});

const QuotesLibraryType = new qlObjectType({
  name: 'QuotesLibrary',
  fields: {
    allQuotes: {
      type: new qlList(QuoteType),
      description: 'A list of quotes in the database',
      resolve: (_, args, { db }) => db.collection('quotes').find().toArray(),
    },
    quotesConnection: {
      type: QuotesConnectionType,
      description: 'A list of quotes in the dabase',
      args: cArgs,
      resolve: (_, args, {db}) => cFromPromiseArray(
        db.collection('quotes').find().toArray(),
        args
      )
    }
  },
});

const queryType = new qlObjectType({
  name: 'RootQuery',
  fields: {
    quotesLibrary: {
      type: QuotesLibraryType,
      description: 'The Quotes Library',
      resolve: () => ({})
    }
  }
});

const mySchema = new qlSchema({
  query: queryType
});

module.exports = mySchema;
