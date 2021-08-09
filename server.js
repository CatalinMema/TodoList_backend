const express = require('express');
const mangoose = require("mongoose");
const app = express();
const port = 5000;
var objectId = require('mongodb').ObjectID;
app.use(express.json())

const connectDb = async() => {
    try{
        await mangoose.connect("mongodb+srv://user1:user1@cluster0.3janr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDb connection SUCCES");
    }catch(error){
        console.log("MongoDb connection Fail");
    }
}
connectDb();

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
    Todo.find({}).then(todo => res.json(todo));
})

app.post('/todos',async(req,res) =>{
    const newTodo = new Todo({
        todo_text:req.body.todo_text,
       
    });
    try {
        await newTodo.save();
        res.send("Todo added")
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})
app.post('/delete',async (req,res) =>{
    // var id = req.body.id;
    // Todo.deleteOne({"_id": objectId(id) }).then(console.log("itemDeleted"))
    try {
        const todo = await Todo.findById(req.body.id);
        console.log(todo);
        await todo.remove();
        res.send("Todo removed");
      } catch {
        res.status(404).send({ error: "Todo is not found!" });
      }
})

app.post('/update', async (req,res) =>{
    var id = req.body.id;
    console.log(id)
    try {
        await Todo.updateOne({_id: id},{todo_text: req.body.todo_text})
        res.send("Todo updated");
      } catch {
        res.status(404).send({ error: "Todo is not found!" });
      }
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})