import { IUser } from '../models/user/user-model';
import { tokenRepository, userRepository } from '../repositories';
import UserEntity from '../entities/user-entity';
import config from '../config/config';
import ERROR from '../middlewares/web_server/http-error';
import tokenService from './token-service';
import generateReferralCode from '../utils/generate-referral-code';


/**
 * Check user exists or not.
 * @param { any } obj
 */
const findUserExists = async (obj: any) => {
  const findUser: IUser | null = await userRepository.findUser(obj.countryCode, obj.mobileNumber);
  if (findUser && findUser._id) {
    //user login
    return true;
  } else {
    return false
  }
};

/**
 * Handle user authentication.
 * Sign up for new users and login for existing users.
 * @param { any } obj
 */
const authUser = async (obj: any) => {
  const findUser: IUser | null = await userRepository.findUser(obj.countryCode, obj.mobileNumber);
  if (findUser && findUser._id) {
    //user login
    return findUser;
  } else {
    return await createUser(obj);
  }
};

/**
 * Handle user sign up.
 * Sign up for new users
 * @param { any } obj
 */
const createUser = async (obj: any) => {
  //user sign-up
  // if (obj.name) {
    const newUser: IUser = await signUpUser(obj.name, obj.countryCode, obj.mobileNumber, obj.referralCode);
    return newUser;
  // } else {
  //   throw new ERROR.BadRequestError('Name should not be empty!');
  // }
};

/**
 * Logout user
 * @param { string } refreshToken
 */
const logOut = async (refreshToken: string) => {
  await tokenRepository.findTokenAndRemove(refreshToken, config.tokenTypes.REFRESH);
};

/**
 * Refresh access and refresh token
 * @param { String }refreshToken
 */
const refreshToken = async (refreshToken: string) => {
  const tokenData = await tokenRepository.findToken(refreshToken, config.tokenTypes.REFRESH);
  const userData = await userRepository.findUserById(tokenData.user);

  if (!userData) throw new ERROR.NotFoundError('User not found!');

  await tokenRepository.removeToken(tokenData._id);
  return await tokenService.generateAuthTokens(userData, 'user');
};

/**
 * User sign-up
 * @param { string } countryCode
 * @param { string } mobileNumber
 */
const signUpUser = async (name: string, countryCode: string, mobileNumber: string, referredBy: string) => {

  //check the refeferral code is valid
  if(referredBy && !(await getUserByReferralCode(referredBy)))  throw new ERROR.NotFoundError("Referrer details not found!");
  //create new referral code for user
  const referralCode = await createReferralCode();
  //create new user entity
  const userEntity: UserEntity = new UserEntity(
    true, //documentStatus
    name || '',
    countryCode,
    mobileNumber,
    '',
    referralCode,
    referredBy ? referredBy : '', // referred by
    [], // FCM tokens
    null,
    new Date(),
    null,
    new Date(),
  );
  //save and return data
  const userData =  await userRepository.createNewUser(userEntity);
  /**
   * @todo
   * credit conins for referral logic goes here
   */
  return userData;
};

/**
 * function to generate referral code
 * @returns 
 */
const createReferralCode = async () => {
  //create new refferal code. This function is defined inside the utis folder
  let newReferrralCode = generateReferralCode();
  //duplication check for the referral code generated.
  while (await referralCodeExists(newReferrralCode)) {
    newReferrralCode = generateReferralCode();
  }
  //return code
  return newReferrralCode;
}

/**
 * function to check the generated referral code already exist or not
 * @param {string} referralode 
 * @returns 
 */
const referralCodeExists = async (referralode: string) => {
  //fetch user data that having the generated referral code
  const userData = await getUserByReferralCode(referralode);
  //return referral code exists status
  return (userData && userData._id) ? true : false;
}

/**
 * fetch user corresponding to a referral code from database
 * @param referralCode 
 * @returns 
 */
const getUserByReferralCode = async (referralCode: string) => {
  return await userRepository.findUserByReferralCode(referralCode);
}

export default {
  findUserExists,
  authUser,
  logOut,
  refreshToken,
  createUser,
};
