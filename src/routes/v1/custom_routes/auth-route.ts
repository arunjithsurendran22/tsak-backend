import { Router } from 'express';
import { authController } from '../../../controllers';
import { verifyUser } from '../../../middlewares/auth/verify-user';


const authRouter = (router: Router) => {

  router.route('/user-auth').post(authController.authenticateUser);
  router.route('/check-user-exists').post(authController.checkUserExists);
  router.route('/log-out').post(verifyUser, authController.logOutUser);
  router.route('/refresh-tokens').post(authController.refreshTokens);

  return router;
  
};

export default authRouter;
