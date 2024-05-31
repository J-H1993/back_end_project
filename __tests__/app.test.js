const db = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')
const jestSorted = require('jest-sorted')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('GET /api/topics', ()=>{
    test('should return a status 200 if data is found', () => {
        return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body})=>{
        expect(body.topics.length).toBe(3)
        const topics = body.topics
        topics.forEach((topic)=>{
            expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
            })
        })
    })
    });
})

describe('GET /api', ()=>{
    test('should return a status 200 if data is found and the correct information read from the endpoints json file', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
        expect(body.endPoints).toEqual(endpoints)
        })
    });
})

describe('GET /api/articles/4', ()=>{
    test('should return a status 200 if the data is found and return a single article of the correct id',() =>{
        return request(app)
        .get('/api/articles/4')
        .expect(200)
        .then(({body})=>{
        expect(body.article.article_id).toBe(4)
        const article = body.article
        expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author:expect.any(String),
            body: expect.any(String),
            created_at:expect.any(String),
            article_img_url: expect.any(String)
        })
        })
    })      
    });

describe('GET /api/articles/9999999', () => {
    test('should return a status code of 404 and a message of article not found', () => {
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Article not found")
        })
        
    });
})

describe('GET/api/articles/very-wrong-req', () =>{
    test('should return a 400 as the data doesnt exist in the table', () => {
        return request(app)
        .get('/api/articles/very-wrong-req')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })
    });
})


describe('.all(*) - handles any endpoint that does not exist', () =>{
    test('should return a 404 error code and the message that the route has not been found', () => {
        return request(app)
        .get("/api/none-existent-endpoint")
        .expect(404)
        .then(({body})=>{
          expect(body.msg).toBe("Route not found")
            })
        });
    })

describe('GET /api/articles', () => {
    test('should return an array of article objects with the correct shape.', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body})=>{
            expect(body.articles.length).toBe(5)
            const articles = body.articles
            expect(articles).toBeSorted({descending: true})
            articles.forEach((article)=>{
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title:expect.any(String),
                    topic:expect.any(String),
                    author:expect.any(String),
                    created_at:expect.any(String),
                    votes:expect.any(Number),
                    article_img_url:expect.any(String),
                    comment_count:expect.any(String)
                })
            })
        })
    });
})

describe('GET /api/articles/6/comments', ()=>{
    test('should return the comments object for the specified article with the correct shape', () =>{
        return request(app)
        .get('/api/articles/6/comments')
        .expect(200)
        .then(({body})=>{
            const comments = body.comments
            expect(comments.length).toBe(1)
            comments.forEach((comment)=>{
                expect(comment).toMatchObject({
                    body:expect.any(String),
                    votes:expect.any(Number),
                    author:expect.any(String),
                    article_id:6,
                    created_at:expect.any(String)
                })
            })


        })
    })
})

describe('GET /api/articles/incorrect_query/comments',()=>{
    test('should return a 400 as it is a bad request', () => {
        return request(app)
        .get('/api/articles/incorrect_query/comments')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    });
})

describe('POST /api/articles/:article_id/comments',()=>{
    test('should add a comment for the correct article based on given id ', () => {
        return request(app)
        .post('/api/articles/6/comments')
        .send({username:'lurker',body:'I like tacos'})
        .expect(201)
        .then(({body}) =>{
        expect(body.comment).toMatchObject({
            comment_id:expect.any(Number),
            body:'I like tacos',
            votes:expect.any(Number),
            author:'lurker',
            article_id:6,
            created_at:expect.any(String)
        })
        })
        })
   });

describe('POST /api/articles/6/comments', () =>{
    test('should return 404 route not found', () => {
        return request(app)
        .post('/api/articles/6/missSpelled')
        .send({username:'lurker',body:'I like tacos'})
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Route not found')
        })
    });
})

describe('POST /api/articles/6/comments', () =>{
    test('should return 400 bad request, input will cause database error', () => {
        return request(app)
        .post('/api/articles/6/comments')
        .send({Chicken:'lurker',Horse:'I like tacos'})
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    });
})

describe('PATCH /api/articles/5', () =>{
    test('should return a 201 code and the updated object with votes incremented 3 times', () =>{
        return request(app)
        .patch('/api/articles/5')
        .send({inc_votes: 3})
        .expect(201)
        .then(({body}) =>{
            expect(body.patchedArticle).toMatchObject({
                article_id:5,
                title:expect.any(String),
                topic:expect.any(String),
                author:expect.any(String),
                created_at:expect.any(String),
                votes:3,
                article_img_url:expect.any(String),
            })
        })
    })
})

describe('PATCH /api/articles/9999999', () =>{
    test('should return a 404 as the article to patch does not exist', () =>{
        return request(app)
        .patch('/api/articles/9999999')
        .send({inc_votes: 3})
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Article not found patch failed")
        })

    })
})

describe('PATCH /api/articles/5', () =>{
    test('should return a 400 as the input will cause a database error', () =>{
        return request(app)
        .patch('/api/articles/5')
        .send({inc_votes:'incorrect_data'})
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe("Bad Request")
        })

    })
})

describe('DELETE /api/comments/:comment_id', () =>{
    test('should return a 204 status and no content ', () => {
        return request(app)
        .delete('/api/comments/6')
        .expect(204)
        .then(({body})=>{
            expect(body).toEqual({})
        })
    });
})

describe('DELETE /api/comments/:comment_id', () =>{
    test('should return a 404 as the comment will not exist', () =>{
        return request(app)
        .delete('/api/comments/99999999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Comment not found, nothing to delete')
        })
    });
})

describe('DELETE /api/comments/:comment_id', () =>{
    test('should return a 404 as the input will cause a database error', () =>{
        return request(app)
        .delete('/api/missSpelled/6')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Route not found')
        })
    });
})

describe('GET /api/users', ()=>{
    test('should respond with an array of all user objects with the correct shape.', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body})=>{
            expect(body.users.length).toBe(4)
            const users = body.users
            users.forEach((user)=>{
                expect(user).toMatchObject({
                    username:expect.any(String),
                    name:expect.any(String),
                    avatar_url:expect.any(String)
                })
            })
        })
    });
})

describe('GET /api/users', ()=>{
    test('should respond with the correct error code and message.', () => {
        return request(app)
        .get('/api/missSpelt')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("Route not found")
        })
    })
})

describe('GET /api/articles?topic=cats', ()=>{
    test('should filter responses based on the topic added in the query', ()=>{
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body})=>{
            expect(body.articles.length).toBe(1)
        })
    })
})

describe('GET /api/articles?topic=cats', () =>{
    test('should return 404 with misspelt query ', () => {
        return request(app)
        .get('/api/articles?topic=miss_spelt')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('Topic not found')
        })
    });
})