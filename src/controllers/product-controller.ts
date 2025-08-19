import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../utils/api-response';
import { productService } from '../services';
import { IProduct } from '../models/products/product-model';

/**
 * Get products (user)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pageNumber = '1', pageSize = '10', searchTag = '' } = req.query;

    const result = await productService.getProducts({
      pageNumber: parseInt(pageNumber as string, 10),
      pageSize: parseInt(pageSize as string, 10),
      searchTag: searchTag as string,
    });

    const apiResponse = new ApiResponse<typeof result>();
    apiResponse.message = 'Success!';
    apiResponse.data = result;
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Get product details (user)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getProductDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params;

    const product = await productService.getProductDetails(productId);

    const apiResponse = new ApiResponse<{ product: IProduct | null }>();
    apiResponse.message = 'Product retrieved successfully!';
    apiResponse.data = { product };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Create product (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId, name, description, price, images, stock, documentStatus } = req.body;

    const payload: Partial<IProduct> = {
      name,
      description,
      price,
      images,
      stock,
      documentStatus,
      createdUser: adminId,
    };

    const createdProduct = await productService.createProduct(adminId, payload);

    const apiResponse = new ApiResponse<{ createdProduct: IProduct | null }>();
    apiResponse.message = 'Product created successfully!';
    apiResponse.data = { createdProduct };
    apiResponse.statusCode = 201;

    res.status(201).json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId, name, description, price, images, stock, documentStatus } = req.body;
    const { productId } = req.params;

    const updateData: Partial<IProduct> = {
      name,
      description,
      price,
      images,
      stock,
      documentStatus,
      updatedUser: adminId,
    };

    const updatedProduct = await productService.updateProduct(adminId, productId, updateData);

    const apiResponse = new ApiResponse<{ updatedProduct: IProduct | null }>();
    apiResponse.message = 'Product updated successfully!';
    apiResponse.data = { updatedProduct };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { productId } = req.params;

    const deleted = await productService.deleteProduct(adminId, productId);

    const apiResponse = new ApiResponse<{ deleted: boolean }>();
    apiResponse.message = 'Product deleted successfully!';
    apiResponse.data = { deleted };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getAllProductsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { pageNumber = '1', pageSize = '10', searchTag = '', fromDate = '', toDate = '' } = req.query;

    const result = await productService.getAllProductsAdmin(adminId, {
      pageNumber: parseInt(pageNumber as string, 10),
      pageSize: parseInt(pageSize as string, 10),
      searchTag: searchTag as string,
      fromDate: fromDate as string,
      toDate: toDate as string,
    });

    const apiResponse = new ApiResponse<typeof result>();
    apiResponse.message = 'Success!';
    apiResponse.data = result;
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Get product details (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getProductDetailsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { productId } = req.params;

    const product = await productService.getProductDetailsAdmin(adminId, productId);

    const apiResponse = new ApiResponse<{ product: IProduct | null }>();
    apiResponse.message = 'Product retrieved successfully!';
    apiResponse.data = { product };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

export default {
  // USER
  getProducts,
  getProductDetails,
  // ADMIN
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductDetailsAdmin,
};
