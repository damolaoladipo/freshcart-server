import fs from "fs";
import logger from "../../utils/logger.util";
import User from "../../models/User.model";

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

        let user = await User.create(item);

        if (user) {
          count += 1;
        }

        
      }

    }


    if (count > 0) {
      logger.log({
        data: "Users seeded successfully",
        type: "success",
      });
    }

  } catch (err) {
      logger.log({ label: "ERR for user data", data: err });
  }
};
