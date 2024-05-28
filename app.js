const express = require('express');
const {sendTopics} = require('./controllers/news.controllers')

const app = express()

app.get('/api/topics',sendTopics)



app.use((err, req, res, next)=>{
if(err.code ==='22P02'|| err.code === '42703') {
    res.status(400).send({msg:'Bad Request'})
}
else{
    console.log(err);
    res.status(500).send('Server Error.')
} 
})




module.exports = app