const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { response } = require('express');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({limit: '1mb'}));

// connect to mongo db
mongoose.connect('mongodb://localhost/todolistDB', {useNewUrlParser: true});

// create a schema/properties
const todoSchema = mongoose.Schema({
    name: String,
    isCompleted: Boolean
});

// create db collection
const TodoModel = mongoose.model('todolist', todoSchema);

// CREATE - Saving an item 
app.post('/addTodo', async (req, res) => {
    try {
        console.log(req.body);
        const todoItem = new TodoModel(req.body);
        const result = await todoItem.save();   
        res.send(result);
    } catch(err) {
        response.status(500).send(err);
    }
});

// READ or get all data
app.get('/todolist', async(req, res) => {
    try {
        const result = await TodoModel.find().exec();
        res.send(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

// READ or get specific data
app.get('/todolist/:id', async(req, res) => {
    try {
        const result = await TodoModel.findById(req.params.id).exec();
        res.send(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

// UPDATE data
app.put('/todo/:id', async(req, res) => {
    try {
        const todoItem = await TodoModel.findById(req.params.id).exec();
        todoItem.set(req.body);
        const result = await todoItem.save();
        res.send(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.delete('/deleteTodo/:id', async (req, res) => {
    try {
        const result = await TodoModel.deleteOne({_id: req.params.id}).exec();
        res.send(result);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.delete('/deleteAll/', async (req, res) => {
    try {
        const result = await TodoModel.deleteMany({}).exec();
        res.send(result);
    } catch(err) {
        res.status(500).send(err);
    }
});



app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

// TodoModel.deleteMany({}, (err) => {
//     if(err) {
//         console.log(err);
//     }else {
//         console.log('deleted all');
//     }
// })


app.listen(3000, () => {
    console.log('port listening to 3000...');
});