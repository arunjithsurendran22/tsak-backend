import { Router } from 'express';
import verifyAppProxy from '../../../middlewares/shopify/verifyAppProxy';
import { productService } from '../../../services';

const proxyRouter = Router();

proxyRouter.get('/products', verifyAppProxy, async (req, res, next) => {
  try {
    const pageNumber = parseInt((req.query.pageNumber as string) ?? '1', 10);
    const pageSize   = parseInt((req.query.pageSize as string) ?? '8', 10);
    const searchTag  = (req.query.searchTag as string) ?? '';

    // Reuse your service (public: documentStatus:true)
    const result = await productService.getProducts({ pageNumber, pageSize, searchTag });

    // Map to storefront shape (IMPORTANT: /cart/add.js needs variantId if you plan to add-to-cart)
    const products = result.products.map(p => ({
      id: String(p._id),
      title: p.name,
      description: p.description,
      price: p.price,
      image: p.images?.[0] ?? '',
      stock: p.stock,
      // variantId: 00000000000000 // TODO if you sync products with Shopify
    }));

    res.json({ products, totalCount: result.totalCount, hasNext: result.hasNext });
  } catch (e) { next(e); }
});

export default proxyRouter;
