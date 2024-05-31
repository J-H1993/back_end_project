const express = require('express');
const {sendTopics, sendOrderedArticles, sendfilteredArticles} = require('./controllers/news.controllers')
const {sendEndpoints} = require('./controllers/news.controllers')
const {sendArticle} = require('./controllers/news.controllers')
const {sendArticleCommentsById} = require('./controllers/news.controllers')
const {addComment} = require('./controllers/news.controllers')
const {addVotes} = require('./controllers/news.controllers')
const {removeComment} = require('./controllers/news.controllers')
const {sendUsers} = require('./controllers/news.controllers')
const app = express()

app.use(express.json())





app.get('/api/topics',sendTopics)

app.get('/api',sendEndpoints)

app.get('/api/articles/:article_id', sendArticle)

app.get('/api/articles', sendOrderedArticles)

app.get('/api/articles/:article_id/comments',sendArticleCommentsById)

app.post('/api/articles/:article_id/comments', addComment)

app.patch('/api/articles/:article_id', addVotes)

app.delete('/api/comments/:comment_id', removeComment)

app.get('/api/users', sendUsers)







app.all('*', (req, res)=>{
    res.status(404).send ({msg:"Route not found"})
})

app.use((err, req, res, next)=>{
    if(err.status && err.msg){
    res.status(err.status).send({msg:err.msg}) 
    }else next(err)
})

app.use((err, req, res, next)=>{
if(err.code) {
    res.status(400).send({msg:'Bad Request'})
}
else{
    console.log(err);
    res.status(500).send('Server Error.')
} 
})




module.exports = app