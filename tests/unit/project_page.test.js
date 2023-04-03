const request = require('supertest');
const { app, db } = require('../../server.js'); // assuming db and app are exported in server.js
const expect = require('chai').expect;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

describe('Project routes', () => {
  let server;

  beforeEach((done) => {
    db.connect((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Database connected!");
      }
      done();
    });
  });

  afterEach((done) => {
    db.end(done);
  });
  

  describe('POST /profile/create-project', () => {
    it('should return status 200', async () => {
      const res = await request(app)
        .post('/profile/create-project')
        .expect(200);
    });
  });

  describe('GET /profile', () => {
    it('should return status 200', async () => {
      const res = await request(app)
        .get('/profile')
        .expect(200);
    });
  });
