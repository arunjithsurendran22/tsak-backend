import { Router } from 'express';
import { bannerController } from '../../../controllers';
import { verifyAdmin } from '../../../middlewares/auth/verify-admin';

const bannerRouter = (router: Router) => {
  // USER
  router.route('/get-banners').get(bannerController.getBanners);
  router.route('/get-banner-details/:bannerId').get(bannerController.getBannerDetails);

  // ADMIN (full CRUD)
  router.route('/admin/create-banner').post(verifyAdmin, bannerController.createBanner);
  router.route('/admin/update-banner/:bannerId').put(verifyAdmin, bannerController.updateBanner);
  router.route('/admin/delete-banner/:bannerId').delete(verifyAdmin, bannerController.deleteBanner);
  router.route('/admin/get-all-banners').get(verifyAdmin, bannerController.getAllBannersAdmin);
  router.route('/admin/get-banner-details/:bannerId').get(verifyAdmin, bannerController.getBannerDetailsAdmin);

  return router;
};

export default bannerRouter;
