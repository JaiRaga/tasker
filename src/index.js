const { ApolloServer, gql } = require('apollo-server')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
dotenv.config()

const { DB_NAME, DB_URI } = process.env

const books = [
	{
		title: 'The Awakening of Jai',
		author: 'Kate Chopin',
	},
	{
		title: 'City of Glass',
		author: 'Paul Auster',
	},
	{
		title: 'City of Angels',
		author: 'Raga',
		code: 'raga',
	},
]

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
	# The "Query" type is special: it lists all of the available queries that
	# clients can execute, along with the return type for each. In this
	# case, the "books" query returns an array of zero or more Books (defined above).
	type Query {
		books: [Book]
	}

	# This "Book" type defines the queryable fields for every book in our data source.
	type Book {
		title: String
		author: String
		code: String
	}
`

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
		books: (root, data, context) => {
			console.log(context)
			return books
		},
	},
}

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

	// The ApolloServer constructor requires two parameters: your schema
	// definition and your set of resolvers.
	const server = new ApolloServer({ typeDefs, resolvers, context })

	// The `listen` method launches a web server.
	server.listen().then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`)
	})
}

start()
