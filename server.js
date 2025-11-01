//dependesncies importing
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Pusher from 'pusher';

import mongomessages from './messagemodel.js';



//app config
const app = express();
const port = process.env.PORT || 9000;


//pusher setup
const pusher = new Pusher({
  appId: "2071720",
  key: "885ae5f07ffd887fa6d1",
  secret: "5c0837595356a298ace2",
  cluster: "ap2",
  useTLS: true
});

//middlewares
app.use(express.json());
app.use(cors());

//db config
const connection_url = 'mongodb+srv://admin:TVqncsSmZQ4doerW@messengercluster.tws6xzr.mongodb.net/?appName=messengercluster'
// Connect without deprecated/unsupported options. Modern mongoose sets recommended defaults.
mongoose.connect(connection_url)
    .then(() => {
        console.log('DB connected');

        // Set up a change stream on the native MongoDB collection after DB is connected.
        // Use `mongoose.connection.db.collection(...)` to get the native driver collection.
        try {
            const changeStream = mongoose.connection.db.collection('messages').watch();
            // `changeStream` is an EventEmitter-like ChangeStream; attach event listener.
            changeStream.on('change', (change) => {
                pusher.trigger('messages', 'newmessages', { change });
            });
        } catch (err) {
            console.error('Failed to create change stream:', err);
        }
    })
    .catch(err => console.error('Mongo connection error:', err));


//api routes
app.get('/', (req, res) => res.status(200).send('hello this is a messenger backend'));

app.post('/save/messages', (req, res) => {
    const dbMessage = req.body;
    console.log(dbMessage);
    mongomessages.create(dbMessage)
        .then((data) => res.status(201).send(data))
        .catch((err) => res.status(500).send(err)); 
});

app.get('/retrieve/conversation', (req, res) => {
    mongomessages.find()
        .then((data) => {
            // sort messages by timestamp (ascending). timestamps are stored as strings in the schema
            try {
                data.sort((b,a) => new Date(b.timestamp) - new Date(a.timestamp));
            } catch (e) {
                // if parsing fails, leave original order
                console.error('Error sorting messages by timestamp:', e);
            }
            return res.status(200).send(data);
        })
        .catch((err) => res.status(500).send(err));
});


//listen
app.listen(port, () => console.log(`listening on localhost:${port}`));