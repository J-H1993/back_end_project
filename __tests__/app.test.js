const db = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')

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
            console.log(body)
        expect(body.article.article_id).toBe(4)
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
