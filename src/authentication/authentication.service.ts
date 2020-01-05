import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/userWithEmailAlreadyExistedException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import TokenData from '../interfaces/tokenData.interface';
import User from '../users/user.interface';
import userModel from './../users/user.model';

class AuthenticationService {
  public user = userModel;

  public async register(userData) {
    if (await this.user.findOne({ email: userData.email })) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.user.create({
      ...userData,
      password: hashedPassword,
    });
    user.password = '';
    return {
      user,
    };
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};path=/`;
  }

  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret: string = (process.env.JWT_SECRET as string);
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}

export default AuthenticationService;
