const fs = require('fs');
const { setupStrapi, cleanupStrapi } = require("../helpers/strapi");
require('../helpers/hello.js')
beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
    await cleanupStrapi();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});