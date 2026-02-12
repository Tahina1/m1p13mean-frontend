export interface DefaultData<T = any> {
  status: string;
  code: number;
  message: string;
  data?: T;
  errors?: Errors[];
  meta?: Meta;
}

export interface Errors {
  field?: string;
  message: string;
}

export interface Meta {
  page?: number;
  size?: number;
  total?: number;
}
