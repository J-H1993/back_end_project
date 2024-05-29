const {selectTopics} = require('../models/news.models')
const {selectArticleById} = require('../models/news.models')
const {selectOrderedArticles} = require('../models/news.models')
const endPoints = require('../endpoints.json')

exports.sendTopics = (req, res, next) => {
    selectTopics().then((topics)=>res.status(200).send({topics}))
    .catch(next)
}

exports.sendEndpoints = (req, res, next) =>{
    res.status(200).send({endPoints})
}

exports.sendArticle = (req, res, next) =>{
    const {article_id} = req.params
   selectArticleById(article_id).then((article)=> res.status(200).send({article}))
   .catch(next)
}

exports.sendOrderedArticles = (req, res, next) =>{
    selectOrderedArticles().then((articles)=> res.status(200).send({articles}))
    .catch(next)
}