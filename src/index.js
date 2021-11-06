const { ApolloServer, gql } = require('apollo-server')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
dotenv.config()

const { DB_NAME, DB_URI } = process.env

const typeDefs = gql`
	type Query {
		myTaskLists: [TaskList!]!
	}

	type Mutation {
		signUp(input: SignUpInput): AuthUser!
		signIn(input: SignInInput): AuthUser!
	}

	input SignUpInput {
		email: String!
		password: String!
		name: String!
		avatar: String
	}

	input SignInInput {
		email: String!
		password: String!
	}

	type AuthUser {
		user: User!
		token: String!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		avatar: String
	}

	type TaskList {
		id: ID!
		title: String!
		progress: Float!
		createdAt: String!

		users: [User!]!
		todo: [Todo!]!
	}

	type Todo {
		id: ID!
		content: String!
		isCompleted: Boolean!

		taskList: TaskList!
	}
`

const resolvers = {
	Query: {
		myTaskLists: () => [],
	},
	Mutation: {
		// signUp: (root, data, context) => {}
		signUp: async (_, { input }, { db }) => {
			const hashedPassword = bcrypt.hashSync(input.password)
			const user = {
				...input,
				password: hashedPassword,
			}
			// Save to db
			const result = await db.collection('Users').insertOne(user)
			console.log(result)
		},
		signIn: () => {},
	},
}

const start = async () => {
	const uri = DB_URI
	const client = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	client.connect()

	const db = client.db(DB_NAME)
	console.log(`******* ${db.namespace} is alive! *******`)

	const context = {
		db,
	}

	const server = new ApolloServer({ typeDefs, resolvers, context })

	// The `listen` method launches a web server.
	server.listen().then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`)
	})
}

start()
