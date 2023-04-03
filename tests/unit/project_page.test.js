const request = require('supertest');
const controller = require("../controllers/project");
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
        server = app.listen(3000, () => {
          console.log("Server started on port 3000!");
          done();
        });
      }
    });
  });

  afterEach((done) => {
    server.close(() => {
      console.log("Server closed!");
      db.end(done);
    });
  });

  describe('POST /profile/create-project', () => {
    it('should return status 200', async () => {
      const res = await request(server)
        .post('/profile/create-project')
        .send({ projectName: 'Test Project', users: [{ id: 1 }, { id: 2 }] })
        .set('Cookie', ['token=xyz'])
        .expect(200);
      expect(res.body).to.have.property('projectId');
    });
  });

  describe('GET /profile', () => {
    it('should return status 200', async () => {
      const res = await request(server)
        .get('/profile')
        .set('Cookie', ['token=xyz'])
        .expect(200);
      expect(res.text).to.contain('Welcome to your profile page!');
    });
  });
});
