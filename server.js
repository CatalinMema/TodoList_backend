const express = require('express');
const mangoose = require("mongoose");
const app = express();
const port = 5000;
var objectId = require('mongodb').ObjectID;
app.use(express.json())

// const connectDb = async() => {
//     try{
//         await mangoose.connect("mongodb+srv://user1:user1@cluster0.3janr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         })
//         console.log("MongoDb connection SUCCES");
//     }catch(error){
//         console.log("MongoDb connection Fail");
//     }
// }
// connectDb();
const { MongoClient } = require('mongodb')
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url,{ useNewUrlParser: true,useUnifiedTopology: true})

// Database Name
const dbName = 'myProject'
async function main() {
  // Use connect method to connect to the server
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  const collection = db.collection('todos')

  // the following code examples can be pasted here...
  
  return 'done.'
}

main()
  .then(console.log)
  .catch(console.error)
  
const TodoSchema = new mangoose.Schema({
    // id:{
    //     type: String,
    //     required:true,
    // },
    todo_text:{
        type: String,
        required: true
    },
})

const Todo = mangoose.model('todo',TodoSchema);

app.get('/getTodos', async (req,res)=>{
    const db = client.db(dbName)
    const collection = db.collection('todos')
    // Todo.find({}).then(todo => res.json(todo));
    const findResult = await collection.find({}).toArray();
    res.send(findResult)
    //console.log('Found documents =>', findResult)
})

app.post('/todos',async(req,res) =>{
    const db = client.db(dbName)
    const collection = db.collection('todos')
   
    const newTodo = new Todo({
        todo_text:req.body.todo_text,
       
    });
    const insertResult = await collection.insertOne(newTodo)
    // console.log(newTodo);
    // console.log('Inserted documents =>', insertResult);
    res.send("Added")
    // try {
    //     await newTodo.save();
    //     res.send("Todo added")
    // } catch (error) {
    //     console.log(error);
    //     res.send(error)
    // }
})
app.post('/delete',async (req,res) =>{
    // var id = req.body.id;
    // // Todo.deleteOne({"_id": objectId(id) }).then(console.log("itemDeleted"))
    // try {
    //     const todo = await Todo.findById(req.body.id);
    //     await todo.remove();
    //     res.send("Todo removed");
    //   } catch {
    //     res.status(404).send({ error: "Todo is not found!" });
    //   }
    const db = client.db(dbName)
    const collection = db.collection('todos')
    const deleteResult = await collection.deleteOne({ _id: objectId(req.body.id)});
    
console.log('Deleted documents =>', deleteResult)
})

app.post('/update', async (req,res) =>{
    // var id = req.body.id;
    // try {
    //     await Todo.updateOne({_id: objectId(id)},{todo_text: req.body.todo_text})
    //     res.send("Todo updated");
    //   } catch {
    //     res.status(404).send({ error: "Todo is not found!" });
    //   }
    const db = client.db(dbName)
    const collection = db.collection('todos')
    const updateResult = await collection.updateOne({_id: objectId(req.body.id)}, { $set: { todo_text: req.body.todo_text } })
    // const updateResult = await collection.updateOne({_id: objectId(req.body.id)},{todo_text: req.body.todo_text})
    console.log('Updated documents =>', updateResult)
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})