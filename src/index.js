const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()

const connectionString = 'mongodb+srv://<username>:<password>@simple-board-cluster.aomkb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' //

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    
    app.get("/", (req, res)=>{
        db.collection('quotes').find().toArray()
        .then(results =>{
            res.render('index.ejs', {quotes: results})
        })
        .catch(err => console.error(err))
        
        
    })

    app.post('/quotes', (req, res)=>{
        console.log(req.body)
        quotesCollection.insertOne(req.body)
        .then(result=>{
            console.log(result)
            res.redirect('/')
        })
        .catch(error=> console.error(error))
    
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
              $set: {
                name: req.body.name,
                quote: req.body.quote
              }
            },
            {
                upsert: true
            }
          )
            .then(result => {
                console.log(result)
                if (res.ok) return res.json('Success')
            })
            .catch(error => console.error(error))
    })


    app.listen(3000, ()=>{
        console.log('listening on 3000')
    })
  })


