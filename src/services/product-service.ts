
import ProductEntity from '../entities/product-entity';
import { IProduct } from '../models/products/product-model';
import { productRepository } from '../repositories';
import {
  validateDocumentExists,
  validateNotFound,
  validateRequiredField,
  validateUserAuthorization,
} from '../utils/validators';

/**
 * Get products for user (paginated/searchable)
 * @param {object} options
 * @returns {Promise<{ products: IProduct[], totalCount: number, hasNext: boolean }>}
 */
const getProducts = async ({
  pageNumber,
  pageSize,
  searchTag,
}: {
  pageNumber: number;
  pageSize: number;
  searchTag: string;
}): Promise<{ products: IProduct[]; totalCount: number; hasNext: boolean }> => {
  return await productRepository.getProducts({ pageNumber, pageSize, searchTag });
};

/**
 * Get single product for user
 * @param {string} productId
 * @returns {Promise<IProduct | null>}
 */
const getProductDetails = async (productId: string): Promise<IProduct | null> => {
  validateRequiredField(productId, 'productId');
  const product = await productRepository.getById(productId);
  validateNotFound(product, 'product');
  return product;
};

/**
 * Create product (admin) — uses ProductEntity
 * @param {string} adminId
 * @param {Partial<IProduct>} payload
 * @returns {Promise<IProduct | null>}
 */
const createProduct = async (
  adminId: string,
  payload: Partial<IProduct>
): Promise<IProduct | null> => {
  validateUserAuthorization(adminId);

  // required fields
  validateRequiredField(payload?.name as string, 'name');
  validateRequiredField(payload?.description as string, 'description');
  validateRequiredField(payload?.price as number, 'price');
  validateRequiredField(payload?.stock as number, 'stock');

  if (!Array.isArray(payload?.images) || payload!.images!.length === 0) {
    throw new Error('images is required and must be a non-empty array');
  }

  // Optional duplicate check (name)
  if (payload.name) {
    const existingName = await productRepository.findNameAlreadyExists(payload.name);
    validateDocumentExists(existingName, 'name');
  }

  // Build the entity
  const entity = new ProductEntity(
    payload.documentStatus ?? true,              // documentStatus
    payload.name!,                               // name
    payload.description!,                        // description
    payload.price!,                              // price
    payload.images!,                             // images
    payload.stock!,                              // stock
    (payload.createdUser as any) ?? (adminId as any), // createdUser
    new Date(),                                  // createdAt
    null,                                        // updatedUser
    null                                         // updatedAt
  );

  // Persist
  const created = await productRepository.create({ ...(entity as any) });
  validateNotFound(created, 'createdProduct');
  return created;
};

/**
 * Update product (admin)
 * @param {string} adminId
 * @param {string} productId
 * @param {Partial<IProduct>} updateData
 * @returns {Promise<IProduct | null>}
 */
const updateProduct = async (
  adminId: string,
  productId: string,
  updateData: Partial<IProduct>
): Promise<IProduct | null> => {
  validateUserAuthorization(adminId);
  validateRequiredField(productId, 'productId');

  const existing = await productRepository.getById(productId);
  validateNotFound(existing, 'existingProduct');

  // Optional duplicate check on name (exclude current product)
  if (updateData.name) {
    const existingName = await productRepository.findNameAlreadyExists(updateData.name, productId);
    validateDocumentExists(existingName, 'name');
  }

  const updated = await productRepository.update(productId, {
    ...updateData,
    updatedUser: (updateData?.updatedUser as any) ?? (adminId as any),
  });
  validateNotFound(updated, 'updatedProduct');
  return updated;
};

/**
 * Delete product (admin)
 * @param {string} adminId
 * @param {string} productId
 * @returns {Promise<boolean>}
 */
const deleteProduct = async (adminId: string, productId: string): Promise<boolean> => {
  validateUserAuthorization(adminId);
  validateRequiredField(productId, 'productId');

  const existing = await productRepository.getById(productId);
  validateNotFound(existing, 'existingProduct');

  const deleted = await productRepository.deleteById(productId);
  return Boolean(deleted);
};

/**
 * Get all products (admin)
 * @param {string} adminId
 * @param {object} options
 * @returns {Promise<{ products: IProduct[], totalCount: number, hasNext: boolean }>}
 */
const getAllProductsAdmin = async (
  adminId: string,
  {
    pageNumber,
    pageSize,
    searchTag,
    fromDate,
    toDate,
  }: {
    pageNumber: number;
    pageSize: number;
    searchTag: string;
    fromDate: string;
    toDate: string;
  }
): Promise<{ products: IProduct[]; totalCount: number; hasNext: boolean }> => {
  validateUserAuthorization(adminId);
  return await productRepository.getAllProductsAdmin({ pageNumber, pageSize, searchTag, fromDate, toDate });
};

/**
 * Get product details (admin)
 * @param {string} adminId
 * @param {string} productId
 * @returns {Promise<IProduct | null>}
 */
const getProductDetailsAdmin = async (adminId: string, productId: string): Promise<IProduct | null> => {
  validateUserAuthorization(adminId);
  validateRequiredField(productId, 'productId');

  const product = await productRepository.getById(productId);
  validateNotFound(product, 'product');
  return product;
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
