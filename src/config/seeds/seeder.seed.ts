import { seedRoles } from "./role.seed";
import { seedUsers } from "./user.seed";

const seedData = async () => {

    await seedRoles();
    await seedUsers();

}

export default seedData;