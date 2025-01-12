import fs from "fs";
import logger from "../../utils/logger.util";
import User from "../../models/User.model";
import Role from "../../models/Role.model";
import { UserType } from "../../utils/enum.util";
import ErrorResponse from "../../utils/error.util";

const userData = JSON.parse(
  fs.readFileSync(`${__dirname.split("config")[0]}_data/users.json`, "utf-8")
);

export const seedUsers = async () => {
  try {
    let count: number = 0;
    const users = await User.countDocuments();
    
    if (users === 0) {

      for (let i = 0; i < userData.length; i++) {
        let item = userData[i];
        const role = await Role.findOne({ name: item.role || UserType.USER });
        if (!role) {
          return new ErrorResponse(`Role ${item.role ?? UserType.USER} does not exist.`, 400, [])
        }

        let user = await User.create({ ...item, role: role._id });
        if (user) {
          count += 1;
          role.users = [...role.users, user._id];
          await role.save();
        }
      }
    }

    if (count > 0) {
      logger.log({
        data: "User data seeded successfully",
        type: "success",
      });
    }

  } catch (err) {
      logger.log({ label: "ERR for user data", data: err });
  }
};
