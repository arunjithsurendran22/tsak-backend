import { paginate } from '../helper/paginationHelper';
import BANNER from '../models/banner/banner';
import { IBanner } from '../models/banner/banner-model';

/**
 * Get banner by ID
 * @param {string} bannerId
 * @returns {Promise<IBanner | null>}
 */
const getById = async (bannerId: string): Promise<IBanner | null> => {
  return await BANNER.findById(bannerId).exec();
};

/**
 * Create banner
 * @param {Partial<IBanner>} payload
 * @returns {Promise<IBanner | null>}
 */
const create = async (payload: Partial<IBanner>): Promise<IBanner | null> => {
  const doc = await BANNER.create(payload as any);
  return doc?.toObject ? (doc.toObject() as IBanner) : (doc as unknown as IBanner);
};

/**
 * Update banner
 * @param {string} bannerId
 * @param {Partial<IBanner>} updateData
 * @returns {Promise<IBanner | null>}
 */
const update = async (bannerId: string, updateData: Partial<IBanner>): Promise<IBanner | null> => {
  return await BANNER.findByIdAndUpdate(bannerId, updateData, { new: true }).exec();
};

/**
 * Delete banner (hard delete)
 * @param {string} bannerId
 * @returns {Promise<boolean>}
 */
const deleteById = async (bannerId: string): Promise<boolean> => {
  const res = await BANNER.deleteOne({ _id: bannerId }).exec();
  return (res?.deletedCount ?? 0) > 0;
};

/**
 * Check if title already exists (optionally exclude current banner)
 * @param {string} title
 * @param {string} [excludeBannerId]
 * @returns {Promise<IBanner | null>}
 */
const findTitleAlreadyExists = async (title: string, excludeBannerId?: string): Promise<IBanner | null> => {
  const query: any = { title };
  if (excludeBannerId) query._id = { $ne: excludeBannerId };
  return await BANNER.findOne(query).exec();
};

/**
 * Get banners for user (paginated/searchable)
 * @param {object} options
 * @returns {Promise<{ banners: IBanner[], totalCount: number, hasNext: boolean }>}
 */
const getBanners = async ({
  pageNumber,
  pageSize,
  searchTag,
}: {
  pageNumber: number;
  pageSize: number;
  searchTag?: string;
}): Promise<{ banners: IBanner[]; totalCount: number; hasNext: boolean }> => {
  const query: any = {
    documentStatus: true, // show only active/public banners to users
  };

  if (searchTag) {
    query.$or = [
      { title: { $regex: searchTag, $options: 'i' } },
      { description: { $regex: searchTag, $options: 'i' } },
    ];
  }

  const { data, totalCount, hasNext } = await paginate(BANNER, { pageNumber, pageSize }, query);
  return { banners: data, totalCount, hasNext };
};

/**
 * Get all banners (admin)
 * @param {object} options
 * @returns {Promise<{ banners: IBanner[], totalCount: number, hasNext: boolean }>}
 */
const getAllBannersAdmin = async ({
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
}): Promise<{ banners: IBanner[]; totalCount: number; hasNext: boolean }> => {
  const query: any = {};

  if (searchTag) {
    query.$or = [
      { title: { $regex: searchTag, $options: 'i' } },
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

  const { data, totalCount, hasNext } = await paginate(BANNER, { pageNumber, pageSize }, query);
  return { banners: data, totalCount, hasNext };
};

export default {
  getById,
  create,
  update,
  deleteById,
  findTitleAlreadyExists,
  getBanners,
  getAllBannersAdmin,
};
