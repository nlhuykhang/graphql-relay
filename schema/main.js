const {
  GraphQLSchema: qlSchema,
  GraphQLObjectType: qlObjectType,
  GraphQLString: qlString,
  GraphQLInt: qlInt,
  GraphQLList: qlList,
  GraphQLBoolean: qlBoolean,
  GraphQLEnumType: qlEnumType,
} = require('graphql');

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

const queryType = new qlObjectType({
  name: 'RootQuery',
  fields: {
    allQuotes: {
      type: new qlList(QuoteType),
      description: 'A list of quotes in the database',
      resolve: (_, args, { db}) => db.collection('quotes').find().toArray(),
    }
  }
});

const mySchema = new qlSchema({
  query: queryType
});

module.exports = mySchema;
