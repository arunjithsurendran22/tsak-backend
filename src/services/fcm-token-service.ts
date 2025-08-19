import { userRepository } from '../repositories';

const saveFCMToken = async (userId: string, fcmToken: string) => {
  userRepository.addFCMToken(userId, fcmToken);
};

export default {
  saveFCMToken,
};
