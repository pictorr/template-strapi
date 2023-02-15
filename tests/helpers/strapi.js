const Strapi = require("@strapi/strapi");
const fs = require("fs");
const _ = require("lodash");

let instance;

async function setupStrapi() {
  if (!instance) {
    await Strapi().load();
    instance = strapi;
    await instance.server.mount();
  }
  return instance;
}

async function cleanupStrapi() {
  const dbSettings = strapi.config.get("database.connection");
  //close server to release the db-file
  await strapi.server.httpServer.close();

  // close the connection to the database before deletion
  await strapi.db.connection.destroy();

  //delete test database after all tests have completed
  if (dbSettings && dbSettings.connection && dbSettings.connection.filename) {
    const tmpDbFile = dbSettings.connection.filename;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
}

const grantPrivilege = async (
  roleID,
  modelUID,
  route,
  enabled = true,
  policy = ""
) => {
  const service = strapi.plugin("users-permissions").service("role");

  const role = await service.findOne(roleID);

  const [modelID, modelName] = modelUID.split(".")

  _.set(role.permissions[modelID].controllers[modelName], route, { enabled, policy })

  return service.updateRole(roleID, role);
};

/** Updates database `permissions` that role can access an endpoint
 * @see grantPrivilege
 */

const grantPrivileges = async (modelUID, roleID = 1, routes = []) => {
  await Promise.all(routes.map((route) => grantPrivilege(roleID, modelUID, route)));
};

/* Usage:

  await grantPrivileges("api::restaurant.restaurant",
    user.role.id,
    [
      'create'
    ]
  )
*/

module.exports = { setupStrapi, cleanupStrapi, grantPrivilege, grantPrivileges };
