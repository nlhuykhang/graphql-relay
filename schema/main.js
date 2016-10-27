import {
  GraphQLSchema as qlSchema,
  GraphQLObjectType as qlObjectType,
  GraphQLString as qlString,
  GraphQLInt as qlInt,
  GraphQLList as qlList,
} from 'graphql';

const roll = () => Math.floor(6 * Math.random()) + 1;

const queryType = new qlObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      type: qlString,
      resolve: () => 'world'
    },
    diceRoll: {
      type: new qlList(qlInt),
      args: {
        count: {
          type: qlInt,
          defaultValue: 2,
        }
      },
      resolve: (_, args) => {
        const rolls = [];
        for (let i = 0; i < args.count; i++) {
          rolls.push(roll());
        }
        return rolls;
      }
    },
    usersCount: {
      type: qlInt,
      resolve: (_, args, {db}) => db.collection('users').count(),
    },
  },
});

const mySchema = new qlSchema({
  query: queryType,
});

export default mySchema;
