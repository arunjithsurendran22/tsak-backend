import { Router } from 'express';
import { productController } from '../../../controllers';
import { verifyAdmin } from '../../../middlewares/auth/verify-admin';

const productRouter = (router: Router) => {
  // USER
  router.route('/get-products').get(productController.getProducts);
  router.route('/get-product-details/:productId').get(productController.getProductDetails);

  // ADMIN (full CRUD)
  router.route('/admin/create-product').post(verifyAdmin, productController.createProduct);
  router.route('/admin/update-product/:productId').put(verifyAdmin, productController.updateProduct);
  router.route('/admin/delete-product/:productId').delete(verifyAdmin, productController.deleteProduct);
  router.route('/admin/get-all-products').get(verifyAdmin, productController.getAllProductsAdmin);
  router.route('/admin/get-product-details/:productId').get(verifyAdmin, productController.getProductDetailsAdmin);

  return router;
};

export default productRouter;
