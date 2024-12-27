import { MapRegisteredUserDTO } from "../dtos/auth.dto";
import { IUserDoc } from "../utils/interface.util";

class AuthMapper {
  constructor() {}

  /**
   * @name mapRegisteredUser
   * @param user
   * @returns result
   */
  public async mapRegisteredUser(
    user: IUserDoc
  ): Promise<MapRegisteredUserDTO> {
    const result: MapRegisteredUserDTO = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    
      username: user.username,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      phoneCode: user.phoneCode,
      countryPhone: user.countryPhone,
      
      userType: user.userType,
      role: user.role,

      isSuper: user.isSuper,
      isAdmin: user.isAdmin,
      isMerchant: user.isMerchant,
      isGuest: user.isGuest,
      isUser: user.isUser,      
      isActive: user.isActive,
    };

    return result;
  }
}

export default new AuthMapper();
