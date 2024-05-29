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

describe('/api/articles', () => {
    test('should return an array of article objects with the correct shape.', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body})=>{
            expect(body.articles.length).toBe(5)
            const articles = body.articles
            expect(articles).toBeSorted({descending: true})
        })
    });
})

