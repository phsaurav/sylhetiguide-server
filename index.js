const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ndta.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		console.log('Connected to Database!');
		const database = client.db('sylhetiGuide');
		const packageCollection = database.collection('tourPackages');

		//*Get All Package Api
		app.get('/packages', async (req, res) => {
			const cursor = packageCollection.find({});
			const packages = await cursor.toArray();
			res.send(packages);
		});
	} finally {
		// await client.close();
	}
}

run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Running Sylheti Guide Server');
});

app.listen(port, () => {
	console.log('Running Genius Server on port', port);
});
