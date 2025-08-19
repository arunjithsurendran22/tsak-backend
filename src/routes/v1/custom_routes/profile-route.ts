import { Router } from 'express';
import { profileController } from '../../../controllers';
import { verifyUser } from '../../../middlewares/auth/verify-user';
import { verifyAdmin } from '../../../middlewares/auth/verify-admin';

const profileRouter = (router: Router) => {
  // USER
  router.route('/get-profile').get(verifyUser, profileController.getProfile);
  router.route('/update-profile').put(verifyUser, profileController.updateProfile);

  // ADMIN
  router.route('/admin/get-all-profiles').get(verifyAdmin, profileController.getAllProfilesAdmin);
  router.route('/admin/get-profile-details/:userId').get(verifyAdmin, profileController.getProfileDetails);

 
  return router;
};

export default profileRouter;
