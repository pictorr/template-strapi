const request = require('supertest');

it('should return 200 OK', async done => {
  await request(strapi.server.httpServer)
    .get('/api/hello')
    .expect(200)
    .then((data) => {
      expect(data.text).toBe("Hello World!"); // expect the response text
    });
  });