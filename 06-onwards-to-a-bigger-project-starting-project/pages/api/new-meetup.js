// API routes are special routes/special pages that don't return html code but accepts http requests and returns json data; allows us to build api endpoints
// to create this, create a special folder called "api", this needs to be in the pages folder. NextJS picks any js file stored in api folder and turn them into API routes
// we don't create React components here, we instead define functions which contains server-side code.

// "/api/new-meetup" this will be the url of this api
import { MongoClient } from 'mongodb';

// req obj contains data about incoming requests, res will be sending back a response
async function handler(req, res) {
//   console.log(result);
// return;
  // POST /api/new-meetup
  if(req.method === 'POST'){ // which kind of request was sent
    const data = req.body;
    
    // const { title, image, addrees, description } = data;

    // visit mongodb online to see connection
    // code defined in this file will never show to the client
    // MongoDB is a NoSQL db
    const client = await MongoClient.connect('mongodb+srv://estradamce7:YlRwmwtJnSHMN2TA@cluster0.ksfae2h.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    const result = await meetupsCollection.insertOne(data) // built-in query to insert 1 new document (obj)

    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;