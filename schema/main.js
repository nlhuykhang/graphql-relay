import {
  GraphQLSchema as qlSchema,
  GraphQLObjectType as qlObjectType,
  GraphQLString as qlString,
  GraphQLInt as qlInt,
  GraphQLList as qlList,
  GraphQLBoolean as qlBoolean,
  GraphQLEnumType as qlEnumType,
} from 'graphql';

const roll = () => Math.floor(6 * Math.random()) + 1;

const toTitleCase = str => {
   return str.replace(/\w\S*/g, txt =>
     txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
 };

const LetterCaseType = new qlEnumType({
  name: 'LetterCase',
  values: {
    TITLE: {
      value: 'title',
    },
    UPPER: {
      value: 'upper',
    },
    LOWER: {
      value: 'lower',
    }
  },
});

const EmployeeType = new qlObjectType({
  name: 'Employee',
  fields: () => ({
    name: {
      type: qlString,
      args: {
        upperCase: {
          type: qlBoolean,
        }
      },
      resolve: (obj, args) => {
        const fullName = `${obj.firstName} ${obj.lastName}`;

        return args.upperCase ? fullName.toUpperCase() : fullName;
      }
    },
    nameForCase: {
      type: qlString,
      args: {
        letterCase: {
          type: LetterCaseType,
        }
      },
      resolve: (obj, args) => {
        let fullName = `${obj.firstName} ${obj.lastName}`
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
      type: EmployeeType,
    }
  }),
});

const queryType = new qlObjectType({
  name: 'RootQuery',
  fields: {
    hello: {
      type: qlString,
      resolve: () => 'world'
    },
    diceRoll: {
      type: new qlList(qlInt),
      description: '**Simulate** a dice roll determined by count',
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
      description: 'Total number of users in the database',
      resolve: (_, args, {db}) => db.collection('users').count(),
    },
    exampleEmployee: {
      type: EmployeeType,
      args: {
        test: {
          type: qlInt,
        }
      },
      resolve: () => ({firstName: 'khang', lastName: 'nguyen-le'})
    }
  },
});

const mySchema = new qlSchema({
  query: queryType,
});

export default mySchema;
