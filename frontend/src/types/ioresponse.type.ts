interface IResponse<T> {
  success: boolean;
  err: string[];
  data: T;
}

export type { IResponse };
