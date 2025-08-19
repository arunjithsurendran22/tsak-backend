export default class ApiResponse<T> {
  message?: string;
  status = true;
  statusCode = 200;
  data!: T;
}
