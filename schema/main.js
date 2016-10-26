import {
  GrapQLSchema as qlSchema,
  GraphQLObjectType as qlObjectType,
  GraphQLString as qlString,
} from 'graphql';

const queryType = new qlObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      type: qlString,
      resolve: () => 'world'
    }
  },
});

const mySchema = new qlSchema({
  query: queryType,
});

export default mySchema;
