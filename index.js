const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccuzb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const productCollection = client.db('essentials').collection('product');
        const addedProductCollection = client.db('essentials').collection('addedProduct');

        //Load all data
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })


        //Add new data
        app.post('/inventory', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })


        //Load Single data details
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            // var hex = /[0-9A-Fa-f]{6}/g;
            // const query = (hex.test(id)) ? ObjectId(id) : id;
            const query = { _id: ObjectId(id) }
            console.log(id, query)
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        //DELETE single product
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        //All added products

        app.get("/products", async (req, res) => {
            const cursor = addedProductCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });


    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("essentials running!")
});

app.listen(port, () => {
    console.log('essentials is running on port', port)
});