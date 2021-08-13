const express = require('express');
const mangoose = require("mongoose");
const app = express();
const port = 5000;
// var objectId = require('mongodb').ObjectID;
app.use(express.json())

  const connectDb = async() => {
        try{
            await mangoose.connect("mongodb://localhost:27017", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify:false,
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
        required: true,
        unique: true,
    },
    date_todo:{
        type: Date,
        required:true,
    },
    completed_todo:{
        type: Boolean,
        required:true,
    }
})

const Todo = mangoose.model('todo',TodoSchema);


app.get('/getTodos', async (req,res)=>{
    Todo.find().then(todo => res.json(todo));
     
})
app.get('/getTodos/page/:nr_skips', async (req,res)=>{
    const skipsElements=req.params.nr_skips;
    Todo.find().skip(Number(skipsElements)).limit(8).sort({date_todo:1}).then(todo => res.json(todo))
})
app.get('/search/:text_value', async (req,res)=>{
    const text_todo=req.params.text_value;
    Todo.find({"todo_text" : {$regex : text_todo}}).then(todo => res.json(todo));
})

app.get('/dayfilter/:day', async (req,res)=>{
    Todo.find({"date_todo" : req.params.day}).sort({_id:-1}).then(todo => {
        console.log(todo);
        res.json(todo)});
})

app.get('/dayfilter/:day/:nr_skips', async (req,res)=>{
    const skipsElements=req.params.nr_skips;
    Todo.find({"date_todo" : req.params.day}).skip(Number(skipsElements)).limit(8).sort({_id:-1}).then(todo => {
        console.log(todo);
        res.json(todo)});
})

app.post('/todos',async(req,res) =>{
    const newTodo = new Todo({
        todo_text:req.body.todo_text,
        date_todo:req.body.date_todo,
        completed_todo:req.body.completed_todo,
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
    try {
        await Todo.findByIdAndDelete(req.body.id);
        res.send("Todo removed");
      } catch {
        res.status(404).send({ error: "Todo is not found!" });
      }
})

app.post('/update', async (req,res) =>{
    var id = req.body.id;
    try {
        await Todo.updateOne({_id: id},{todo_text: req.body.todo_text})
        res.send("Todo updated");
      } catch {
        res.status(404).send({ error: "Todo is not found!" });
      }
})


app.post('/completed', async (req,res) =>{
    var id = req.body.id;
    let cmp = req.body.completed_todo;
    try {
        await Todo.updateOne({_id: id},{completed_todo:cmp}).then((result)=>res.send("To do complete"))
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