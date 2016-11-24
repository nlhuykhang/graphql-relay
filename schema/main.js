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
  globalIdField,
  fromGlobalId,
  nodeDefinitions: nodeDef,
  connectionDefinitions: cDef,
  connectionArgs: cArgs,
  connectionFromArray: cFromArray,
  connectionFromPromisedArray: cFromPromiseArray,
  mutationWithClientMutationId,
} = require('graphql-relay');

const {
  ObjectID,
} = require('mongodb');

const globalIdFetcher = (globalId, { db }) => {
  const { type, id } = fromGlobalId(globalId);

  switch (type) {
    case 'QuotesLibrary':
      return quotesLibrary;
    case 'Quote':
      return db.collection('quotes').findOne(ObjectID(id));
    default:
      return null;
  }
};

const globalTypeResolver = obj => obj.type || QuoteType;

const { nodeInterface, nodeField } = nodeDef(
  globalIdFetcher,
  globalTypeResolver
);

const QuoteType = new qlObjectType({
  name: 'Quote',
  interfaces: [nodeInterface],
  fields: {
    id: globalIdField('Quote', obj => obj._id),
    text: {
      type: qlString,
    },
    author: {
      type: qlString,
    },
    likesCount: {
      type: qlInt,
      resolve: obj => obj.likesCount || 0
    }
  },
});

const { connectionType: QuotesConnectionType } = cDef({
  name: 'Quote',
  nodeType: QuoteType,
});

const cArgsWithSearch = cArgs;
cArgs.searchTerm = {
  type: qlString,
};

const QuotesLibraryType = new qlObjectType({
  name: 'QuotesLibrary',
  interfaces: [nodeInterface],
  fields: {
    id: globalIdField('QuotesLibrary'),
    allQuotes: {
      type: new qlList(QuoteType),
      description: 'A list of quotes in the database',
      resolve: (_, args, { db }) => db.collection('quotes').find().toArray(),
    },
    quotesConnection: {
      type: QuotesConnectionType,
      description: 'A list of quotes in the dabase',
      args: cArgsWithSearch,
      resolve: (_, args, {db}) => {
        let findParams = {};
        if (args.searchTerm) {
          findParams.text = new RegExp(args.searchTerm, 'i');
        }
        return cFromPromiseArray(
          db.collection('quotes').find(findParams).toArray(),
          args
        );
      }
    }
  },
});

const quotesLibrary = {
  type: QuotesLibraryType,
}

const queryType = new qlObjectType({
  name: 'RootQuery',
  fields: {
    node: nodeField,
    quotesLibrary: {
      type: QuotesLibraryType,
      description: 'The Quotes Library',
      resolve: () => ({})
    }
  }
});

const thumbsUpMutation = mutationWithClientMutationId({
  name: 'ThumbsUpMutation',
  inputFields: {
    quoteId: {
      type: qlString
    },
  },
  outputFields: {
    quote: {
      type: QuoteType,
      resolve: obj => obj,
    }
  },
  mutateAndGetPayload: (params, { db}) => {
    const id = fromGlobalId(params.quoteId).id;
    console.log(id);
    return Promise.resolve(
      db.collection('quotes').updateOne({
        _id: ObjectID(id),
      }, {
        $inc: {
          likesCount: 1,
        }
      })
    ).then(re => db.collection('quotes').findOne(ObjectID(id)));
  },
});

const mutationType = new qlObjectType({
  name: 'RootMutation',
  fields: {
    thumbsUp: thumbsUpMutation,
  },
});

const mySchema = new qlSchema({
  query: queryType,
  mutation: mutationType,
});

module.exports = mySchema;
