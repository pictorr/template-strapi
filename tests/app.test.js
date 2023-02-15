const fs = require('fs');
const { setupStrapi, cleanupStrapi, grantPrivileges } = require("./helpers/strapi");
require('./hello/hello')
require('./user/index')
beforeAll(async () => {
  await setupStrapi();
  await grantPrivileges("api::hello.hello", 2, ['index'] );  // Gives Public access to endpoint
});

afterAll(async () => {
    await cleanupStrapi();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});