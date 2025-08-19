import { Express, Router, Response } from 'express';
import { adminRouter, authRouter, bannerRouter, deliveryRouter, productRouter, profileRouter, proxyRouter } from './v1/custom_routes';

export const routes = (app: Express) => {
  const router = Router();

  // custom route goes here
  router.use('/api/v1/admin', adminRouter(router));
  router.use('/api/v1/auth', authRouter(router));
  router.use('/api/v1/profile', profileRouter(router));
  router.use('/api/v1/delivery', deliveryRouter(router));
  router.use('/api/v1/banner', bannerRouter(router));
  router.use('/api/v1/product', productRouter(router));
  router.use('/proxy', proxyRouter);
  

  // default rout
  router.get('/', (res: Response) => {
    res.send('This is the router home page');
  });

  app.use(router);
};

export default routes;
