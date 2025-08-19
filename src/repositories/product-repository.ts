import { paginate } from '../helper/paginationHelper';
import { IProduct } from '../models/products/product-model';
import PRODUCT from '../models/products/products';

/**
 * Get product by ID
 * @param {string} productId
 * @returns {Promise<IProduct | null>}
 */
const getById = async (productId: string): Promise<IProduct | null> => {
  return await PRODUCT.findById(productId).exec();
};

/**
 * Create product
 * @param {Partial<IProduct>} payload
 * @returns {Promise<IProduct | null>}
 */
const create = async (payload: Partial<IProduct>): Promise<IProduct | null> => {
  const doc = await PRODUCT.create(payload as any);
  return doc?.toObject ? (doc.toObject() as IProduct) : (doc as unknown as IProduct);
};

/**
 * Update product
 * @param {string} productId
 * @param {Partial<IProduct>} updateData
 * @returns {Promise<IProduct | null>}
 */
const update = async (productId: string, updateData: Partial<IProduct>): Promise<IProduct | null> => {
  return await PRODUCT.findByIdAndUpdate(productId, updateData, { new: true }).exec();
};

/**
 * Delete product (hard delete)
 * @param {string} productId
 * @returns {Promise<boolean>}
 */
const deleteById = async (productId: string): Promise<boolean> => {
  const res = await PRODUCT.deleteOne({ _id: productId }).exec();
  return (res?.deletedCount ?? 0) > 0;
};

/**
 * Check if name already exists (optionally exclude current product)
 * @param {string} name
 * @param {string} [excludeProductId]
 * @returns {Promise<IProduct | null>}
 */
const findNameAlreadyExists = async (name: string, excludeProductId?: string): Promise<IProduct | null> => {
  const query: any = { name };
  if (excludeProductId) query._id = { $ne: excludeProductId };
  return await PRODUCT.findOne(query).exec();
};

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
  searchTag?: string;
}): Promise<{ products: IProduct[]; totalCount: number; hasNext: boolean }> => {
  const query: any = {
    documentStatus: true, // only active products to users
  };

  if (searchTag) {
    query.$or = [
      { name: { $regex: searchTag, $options: 'i' } },
      { description: { $regex: searchTag, $options: 'i' } },
    ];
  }

  const { data, totalCount, hasNext } = await paginate(PRODUCT, { pageNumber, pageSize }, query);
  return { products: data, totalCount, hasNext };
};

/**
 * Get all products (admin)
 * @param {object} options
 * @returns {Promise<{ products: IProduct[], totalCount: number, hasNext: boolean }>}
 */
const getAllProductsAdmin = async ({
  pageNumber,
  pageSize,
  searchTag,
  fromDate,
  toDate,
}: {
  pageNumber: number;
  pageSize: number;
  searchTag?: string;
  fromDate: string;
  toDate: string;
}): Promise<{ products: IProduct[]; totalCount: number; hasNext: boolean }> => {
  const query: any = {};

  if (searchTag) {
    query.$or = [
      { name: { $regex: searchTag, $options: 'i' } },
      { description: { $regex: searchTag, $options: 'i' } },
    ];
  }

  if (fromDate && toDate) {
    const dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);
    const dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);
    query.createdAt = { $gte: dateFrom, $lte: dateTo };
  } else if (fromDate) {
    const dateFrom = new Date(fromDate);
    dateFrom.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: dateFrom };
  } else if (toDate) {
    const dateTo = new Date(toDate);
    dateTo.setHours(23, 59, 59, 999);
    query.createdAt = { $lte: dateTo };
  }

  const { data, totalCount, hasNext } = await paginate(PRODUCT, { pageNumber, pageSize }, query);
  return { products: data, totalCount, hasNext };
};

export default {
  getById,
  create,
  update,
  deleteById,
  findNameAlreadyExists,
  getProducts,
  getAllProductsAdmin,
};
