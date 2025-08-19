export default {
  port: process.env.PORT || 4004,
  mongo: {
    uri: process.env.MONGO_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
  },
  tokenTypes: {
    ACCESS: 'access',
    REFRESH: 'refresh',
  },
  razorpay: {
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  },
  currency: 'INR',
  currencySymbol: '₹',
};
