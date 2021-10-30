const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
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
		const enrollCollection = database.collection('enrollments');

		//*GET All Package Api
		app.get('/packages', async (req, res) => {
			const cursor = packageCollection.find({});
			const packages = await cursor.toArray();
			res.send(packages);
		});

		//*GET A Single Data
		app.get('/packages/:id', async (req, res) => {
			const id = req.params.id;
			console.log('Getting Specific service', id);
			const query = { _id: ObjectId(id) };
			const service = await packageCollection.findOne(query);
			res.json(service);
		});

		//*GET One User Data
		app.post('/enrollments/byemail', async (req, res) => {
			const email = req.body;
			const query = { email: { $in: email } };
			const enrollments = await enrollCollection.find(query).toArray();
			res.send(enrollments);
		});

		//*Enrollment POST
		app.post('/enrollments', async (req, res) => {
			const enroll = req.body;
			const result = await enrollCollection.insertOne(enroll);
			res.send(result);
		});

		//*UPDATE Enrollement data
		app.put('/update/:id', async (req, res) => {
			const id = req.params.id;
			const updatedInfo = req.body;
			const filter = { _id: ObjectId(id) };
			const options = { upsert: true };
			const updateDoc = {
				$set: {
					name: updatedInfo.name,
					email: updatedInfo.email,
					address: updatedInfo.address,
					number: updatedInfo.number,
				},
			};
			const result = await enrollCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			console.log('Updating Users', updatedInfo);
			res.json(result);
		});

		//*DELETE Single Data
		app.delete('/enrollments/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await enrollCollection.deleteOne(query);
			res.json(result);
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
	console.log('Running Server on port', port);
});
