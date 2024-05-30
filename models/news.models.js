const db = require('../db/connection')

exports.selectTopics = () =>{
    return db.query("SELECT * FROM topics").then((result)=>result.rows)
}

exports.selectArticleById = (article_id) =>{
    return db.query("SELECT * FROM articles WHERE article_id = $1;",[article_id])
    .then(({rows})=>{
        const article = rows[0]
        if(!article){
            return Promise.reject({
                status:404,
                msg:'Article not found'
            })
        }
        return article
    })
}

exports.selectOrderedArticles = () =>{
    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id
    Group BY articles.article_id
    ORDER BY articles.created_at DESC`)
    .then((result)=>result.rows)
}

exports.selectArticleCommentsById = (article_id) =>{
    return db.query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then((result)=> result.rows)
    }

exports.insertComment = (article_id ,newComment) => {
    const {username, body} = newComment
    return db.query(`INSERT INTO comments (article_id,author,body) Values ($1,$2,$3) RETURNING *;`, [article_id, username, body])
    .then((result)=> result.rows[0])
}

exports.insertVotes = (article_id, uVotes) =>{
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [uVotes, article_id])
    .then(({rows})=>{
        const patchedArticle = rows[0]
        if(!patchedArticle){
            return Promise.reject({
                status:404,
                msg: "Article not found patch failed"
            })
        }
        return patchedArticle
    })
}