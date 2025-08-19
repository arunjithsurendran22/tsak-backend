import { Router } from 'express';
import deliveryUserController from '../../../controllers/delivery-user-controller';


const deliveryRouter = (router: Router) => {

  router.route('/user/login').post(deliveryUserController.deliveryLogin);
  return router;
  
};

export default deliveryRouter;