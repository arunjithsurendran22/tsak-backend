import { Router } from 'express';
import { adminController } from '../../../controllers';

const adminRouter = (router: Router) => {
  router.route('/register').post(adminController.addAdmin);
  router.route('/login').post(adminController.adminLogin);

  return router;
};

export default adminRouter;