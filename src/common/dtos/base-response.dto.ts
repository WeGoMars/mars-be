export class BaseResponseDto<T> {
  success: boolean;
  message: string;
  data: T;

  constructor(data: T, message = 'Success') {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}