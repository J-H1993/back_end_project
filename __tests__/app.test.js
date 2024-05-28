const db = require('../db/connection')
const app = require('../app')
const request = require('supertest')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const fs = require('fs/promises')
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