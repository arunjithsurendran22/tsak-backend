import BannerEntity from '../entities/banner-entity';
import { IBanner } from '../models/banner/banner-model';
import { bannerRepository } from '../repositories';
import {
  validateDocumentExists,
  validateNotFound,
  validateRequiredField,
  validateUserAuthorization,
} from '../utils/validators';

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
  searchTag: string;
}): Promise<{ banners: IBanner[]; totalCount: number; hasNext: boolean }> => {
  // if you also need user auth here, plug validateUserAuthorization(userId)
  return await bannerRepository.getBanners({ pageNumber, pageSize, searchTag });
};

/**
 * Get single banner for user
 * @param {string} bannerId
 * @returns {Promise<IBanner | null>}
 */
const getBannerDetails = async (bannerId: string): Promise<IBanner | null> => {
  validateRequiredField(bannerId, 'bannerId');
  const banner = await bannerRepository.getById(bannerId);
  validateNotFound(banner, 'banner');
  return banner;
};

/**
 * Create banner (admin) — uses BannerEntity
 * @param {string} adminId
 * @param {Partial<IBanner>} payload
 * @returns {Promise<IBanner | null>}
 */
const createBanner = async (
  adminId: string,
  payload: Partial<IBanner>
): Promise<IBanner | null> => {
  validateUserAuthorization(adminId);

  // required fields (now includes offerTitle + buttonTitle)
  validateRequiredField(payload?.offerTitle as string, 'offerTitle');
  validateRequiredField(payload?.title as string, 'title');
  validateRequiredField(payload?.description as string, 'description');
  validateRequiredField(payload?.buttonTitle as string, 'buttonTitle');

  if (!Array.isArray(payload?.images) || payload!.images!.length === 0) {
    // if you have a validator for arrays, use it; else throw
    throw new Error('images is required and must be a non-empty array');
  }

  // Optional duplicate check (title)
  if (payload.title) {
    const existingTitle = await bannerRepository.findTitleAlreadyExists(payload.title);
    validateDocumentExists(existingTitle, 'title');
  }

  // Build the entity (central place to set sane defaults)
  const entity = new BannerEntity(
    payload.documentStatus ?? true,              // documentStatus
    payload.offerTitle!,                         // offerTitle
    payload.title!,                              // title
    payload.description!,                        // description
    payload.images!,                             // images
    payload.buttonTitle!,                        // buttonTitle
    (payload.createdUser as any) ?? (adminId as any), // createdUser
    new Date(),                                  // createdAt
    null,                                        // updatedUser
    null                                         // updatedAt
  );

  // Persist — repo expects a plain object, spread the entity
  const created = await bannerRepository.create({ ...(entity as any) });
  validateNotFound(created, 'createdBanner');
  return created;
};
/**
 * Update banner (admin)
 * @param {string} adminId
 * @param {string} bannerId
 * @param {Partial<IBanner>} updateData
 * @returns {Promise<IBanner | null>}
 */
const updateBanner = async (
  adminId: string,
  bannerId: string,
  updateData: Partial<IBanner>
): Promise<IBanner | null> => {
  validateUserAuthorization(adminId);
  validateRequiredField(bannerId, 'bannerId');

  const existing = await bannerRepository.getById(bannerId);
  validateNotFound(existing, 'existingBanner');

  // Optional duplicate check on title (exclude current banner)
  if (updateData.title) {
    const existingTitle = await bannerRepository.findTitleAlreadyExists(updateData.title, bannerId);
    validateDocumentExists(existingTitle, 'title');
  }

  const updated = await bannerRepository.update(bannerId, {
    ...updateData,
    updatedUser: (updateData?.updatedUser as any) ?? (adminId as any),
  });
  validateNotFound(updated, 'updatedBanner');
  return updated;
};

/**
 * Delete banner (admin)
 * @param {string} adminId
 * @param {string} bannerId
 * @returns {Promise<boolean>}
 */
const deleteBanner = async (adminId: string, bannerId: string): Promise<boolean> => {
  validateUserAuthorization(adminId);
  validateRequiredField(bannerId, 'bannerId');

  const existing = await bannerRepository.getById(bannerId);
  validateNotFound(existing, 'existingBanner');

  // Hard delete or soft delete — wire to your repo logic
  const deleted = await bannerRepository.deleteById(bannerId);
  return Boolean(deleted);
};

/**
 * Get all banners (admin)
 * @param {string} adminId
 * @param {object} options
 * @returns {Promise<{ banners: IBanner[], totalCount: number, hasNext: boolean }>}
 */
const getAllBannersAdmin = async (
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
): Promise<{ banners: IBanner[]; totalCount: number; hasNext: boolean }> => {
  validateUserAuthorization(adminId);
  return await bannerRepository.getAllBannersAdmin({ pageNumber, pageSize, searchTag, fromDate, toDate });
};

/**
 * Get banner details (admin)
 * @param {string} adminId
 * @param {string} bannerId
 * @returns {Promise<IBanner | null>}
 */
const getBannerDetailsAdmin = async (adminId: string, bannerId: string): Promise<IBanner | null> => {
  validateUserAuthorization(adminId);
  validateRequiredField(bannerId, 'bannerId');

  const banner = await bannerRepository.getById(bannerId);
  validateNotFound(banner, 'banner');
  return banner;
};

export default {
  // USER
  getBanners,
  getBannerDetails,
  // ADMIN
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBannersAdmin,
  getBannerDetailsAdmin,
};
