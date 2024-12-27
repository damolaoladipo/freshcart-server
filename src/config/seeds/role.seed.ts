import fs from "fs";
import logger from "../../utils/logger.util";
import Role from "../../models/Role.model";
import { IRoleDoc } from "../../utils/interface.util";

//read the json
const rolesData = JSON.parse(
  fs.readFileSync(`${__dirname.split("config")[0]}_data/roles.json`, "utf-8")
);

export const seedRoles = async () => {
  try {
    const roles: Array<IRoleDoc> = await Role.find({});
    if (roles.length === 0) {
      const seed = await Role.insertMany(rolesData);

      if (seed) {
        logger.log({
          data: "roles seeded succesfully by Damola",
          type: "info",
        });
      }

      for (let i = 0; i < rolesData.length; i++) {
        let item = rolesData[i];
      
        let role = await Role.create(item);
      
        if (role) {
          console.log(`role ${role.name} seeded succesfully by Damola`);
        }
      }

      
    }
  } catch (err) {
    if (err instanceof Error) {
        logger.log({ label: "ERR for user role", data: err.message, type: "error" });
      } else {
        logger.log({ label: "ERR for user role", data: String(err), type: "error" });
      }
    // logger.log({ label: "ERR for role", data: err.message || err, type: "error" });
  }
};


