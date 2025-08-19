import ERROR from '../middlewares/web_server/http-error';

/**
 * Validates if the user is authorized by checking if userId exists
 * @param {string | undefined} userId
 * @throws {ERROR.AuthorizationError}
 */
export const validateUserAuthorization = (userId?: string): void => {
  if (!userId) {
    throw new ERROR.AuthorizationError('Unauthorized');
  }
};

/**
 * Throws a "Not Found" error for the given resource if it does not exist
 * @param {any} resource
 * @param {string} resourceName
 * @throws {ERROR.NotFoundError}
 */
export const validateNotFound = (resource: any ,resourceName:string): void => {
  if (!resource) {
    throw new ERROR.NotFoundError(`${resourceName} not found`);
  }
};

/**
 * Throws a "Bad Request" error if the provided data is invalid
 * @param {boolean} condition
 * @param {string} message
 * @throws {ERROR.BadRequestError}
 */
export const validateBadRequest = (condition: boolean, message: string): void => {
  if (condition) {
    throw new ERROR.BadRequestError(message);
  }
};

/**
 * Validates if the user exists by checking the user data
 * @param {any} user
 * @throws {ERROR.UserExistsError}
 */
export const validateUserExists = (user: any): void => {
  if (user) {
    throw new ERROR.UserExistsError('Username already exists');
  }
};

/**
 * Validates if the document exists by checking the document
 * @param {any} document
 * @param {string} message
 * @throws {ERROR.DocumentExistsError}
 */
export const validateDocumentExists = (document: any, message: string): void => {
  if (document) {
    throw new ERROR.DocumentExistsError(`${message} already exists`);
  }
};

/**
 * Validates if a specific field is present and non-empty
 * @param {string | undefined | null} field - The value to validate
 * @param {string} fieldName
 * @throws {Error.ValidationError}
 */
export const validateRequiredField = (field: string |undefined | null | number | Date,fieldName: string): void => {
  if (!field) {
    throw new ERROR.ValidationError(`${fieldName} is required`);
  }
};
