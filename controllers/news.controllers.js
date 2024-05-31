const {selectTopics} = require('../models/news.models')
const {selectArticleById} = require('../models/news.models')
const {selectOrderedArticles} = require('../models/news.models')
const {selectArticleCommentsById} = require('../models/news.models')
const {insertComment} = require('../models/news.models')
const {insertVotes} = require('../models/news.models')
const {deleteComment} = require('../models/news.models')
const {selectUsers} = require('../models/news.models')
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
    const {topic} = req.query
    selectOrderedArticles(topic).then((articles)=> res.status(200).send({articles}))
    .catch(next)
}

exports.sendArticleCommentsById = (req, res, next) =>{
    const {article_id} = req.params
    selectArticleCommentsById(article_id).then((comments) => res.status(200).send({comments}))
    .catch(next)
}

exports.addComment = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body
    insertComment(article_id, newComment).then((comment) => res.status(201).send({comment}))
    .catch(next)
}

exports.addVotes = (req, res, next) => {
    const {article_id} = req.params
    const uVotes = req.body.inc_votes
    insertVotes(article_id, uVotes).then((patchedArticle)=> res.status(201).send({patchedArticle}))
    .catch(next)
}

exports.removeComment = (req, res, next) =>{
    const {comment_id} = req.params
    deleteComment(comment_id).then((removedData)=> res.status(204).send(removedData))
    .catch(next)
}

exports.sendUsers = (req, res, next) =>{
    selectUsers().then((users)=> res.status(200).send({users}))
    .catch(next)
}
