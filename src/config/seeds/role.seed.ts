import fs from "fs";
import logger from "../../utils/logger.util";
import Role from "../../models/Role.model";
import { IRoleDoc } from "../../utils/interface.util";

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
          data: "roles data seeded succesfully", type: "info" });
      }

      for (let i = 0; i < rolesData.length; i++) {
        let item = rolesData[i];
      
        let role = await Role.create(item);
      
        if (role) {
          console.log(`role ${role.name} seeded succesfully`);
        }
      }   
    }
  } catch (err) {
    if (err instanceof Error) {
        logger.log({ label: "ERR for user role", data: err.message, type: "error" });
      } else {
        logger.log({ label: "ERR for user role", data: String(err), type: "error" });
      }
  }
};


