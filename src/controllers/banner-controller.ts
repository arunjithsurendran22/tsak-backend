import { Request, Response, NextFunction } from 'express';
import { IBanner } from '../models/banner/banner-model';
import ApiResponse from '../utils/api-response';
import { bannerService } from '../services';

/**
 * Get banners (user)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getBanners = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { pageNumber = '1', pageSize = '10', searchTag = '' } = req.query;

    const result = await bannerService.getBanners({
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
 * Get banner details (user)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getBannerDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bannerId } = req.params;

    const banner = await bannerService.getBannerDetails(bannerId);

    const apiResponse = new ApiResponse<{ banner: IBanner | null }>();
    apiResponse.message = 'Banner retrieved successfully!';
    apiResponse.data = { banner };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Create banner (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const createBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId, offerTitle, title, description, images, buttonTitle, documentStatus } = req.body;

    const payload: Partial<IBanner> = {
      offerTitle,
      title,
      description,
      images,
      buttonTitle,
      documentStatus,
      createdUser: adminId,
    };

    const createdBanner = await bannerService.createBanner(adminId, payload);

    const apiResponse = new ApiResponse<{ createdBanner: IBanner | null }>();
    apiResponse.message = 'Banner created successfully!';
    apiResponse.data = { createdBanner };
    apiResponse.statusCode = 201;

    res.status(201).json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Update banner (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const updateBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId, offerTitle, title, description, images, buttonTitle, documentStatus } = req.body;
    const { bannerId } = req.params;

    const updateData: Partial<IBanner> = {
      offerTitle,
      title,
      description,
      images,
      buttonTitle,
      documentStatus,
      updatedUser: adminId,
    };

    const updatedBanner = await bannerService.updateBanner(adminId, bannerId, updateData);

    const apiResponse = new ApiResponse<{ updatedBanner: IBanner | null }>();
    apiResponse.message = 'Banner updated successfully!';
    apiResponse.data = { updatedBanner };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete banner (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const deleteBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { bannerId } = req.params;

    const deleted = await bannerService.deleteBanner(adminId, bannerId);

    const apiResponse = new ApiResponse<{ deleted: boolean }>();
    apiResponse.message = 'Banner deleted successfully!';
    apiResponse.data = { deleted };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all banners (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getAllBannersAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { pageNumber = '1', pageSize = '10', searchTag = '', fromDate = '', toDate = '' } = req.query;

    const result = await bannerService.getAllBannersAdmin(adminId, {
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
 * Get banner details (admin)
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
const getBannerDetailsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { adminId } = req.body;
    const { bannerId } = req.params;

    const banner = await bannerService.getBannerDetailsAdmin(adminId, bannerId);

    const apiResponse = new ApiResponse<{ banner: IBanner | null }>();
    apiResponse.message = 'Banner retrieved successfully!';
    apiResponse.data = { banner };
    apiResponse.statusCode = 200;

    res.json(apiResponse);
  } catch (error) {
    next(error);
  }
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
