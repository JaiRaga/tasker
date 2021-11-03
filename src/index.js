const { ApolloServer, gql } = require('apollo-server')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
dotenv.config()

const { DB_NAME, DB_URI } = process.env

const typeDefs = gql`
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

const resolvers = {}

const start = async () => {
	const uri = DB_URI
	const client = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	client.connect((err) => {
		const collection = client.db('test').collection('devices')
		// perform actions on the collection object
		client.close()
	})

	const db = client.db(DB_NAME)
	console.log(`${db.namespace} is alive!`)

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
