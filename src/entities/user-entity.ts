class UserEntity {
  documentStatus: boolean;
  name: string;
  countryCode: string;
  mobileNumber: string;
  email: string;
  referralCode: string;
  referredBy:string
  fcmTokens: string[];
  createdUser: string | null;
  createdAt: Date | null;
  updatedUser: string | null;
  updatedAt: Date | null;

  constructor(
    documentStatus: boolean,
    name: string,
    countryCode: string,
    mobileNumber: string,
    email: string,
    referralCode: string,
    referredBy:string,
    fcmTokens: string[],
    createdUser: string | null,
    createdAt: Date | null,
    updatedUser: string | null,
    updatedAt: Date | null,
  ) {

    this.documentStatus = documentStatus;
    this.name = name;
    this.countryCode = countryCode;
    this.mobileNumber = mobileNumber;
    this.email = email;
    this.referralCode = referralCode;
    this.referredBy=referredBy
    this.fcmTokens = fcmTokens;
    this.createdUser = createdUser;
    this.createdAt = createdAt;
    this.updatedUser = updatedUser;
    this.updatedAt = updatedAt;
  }
}

export default UserEntity;
