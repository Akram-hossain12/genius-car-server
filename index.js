const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//midellwear
app.use(cors())
app.use(express())


const uri = `mongodb+srv://${process.env.REACT_USER}:${process.env.REACT_PASSWORD}@cluster1.rwn7rl0.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('geniusData').collection('services');
        const ordersCollection= client.db('geniusData').collection('orders');
        
        app.get('/services',async(req,res)=>{
            const query = {}
            const cursor= serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        });
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query={_id: new ObjectId(id)};
            
            const  service = await serviceCollection.findOne(query)
            res.send(service)
        })
        //orders api

        app.post('/orders',async(req,res)=>{
          const order = req.body;
          const result = await ordersCollection.insertOne(order)
          res.send(result)
        });

        app.get('/orders',async(req,res)=>{
            let query={};
            if(req.query.email){
                query={
                    Email: req.query.email
                }
            };
            const cursor = ordersCollection.find(query)
            const orders= await cursor.toArray()
            res.send(orders)
        })
        app.patch('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const status=req.body.status;
            const query = {_id : new ObjectId(id)}
            const updetedDoc={
                    $set:{
                        status: status
                    }
            }
            const result = await ordersCollection.updateOne(query,updetedDoc)
            res.send(result)
        })

        app.delete('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await ordersCollection.deleteOne(query)
            res.send(result)
        })


    }
    finally{}
}
run().catch(console.dir)

app.get('/' ,(req,res)=>{
    res.send("this is Server for gnius-car")
})
app.listen(port,(req,res)=>{
    console.log(`Genius car starting in the ${port}`)
})