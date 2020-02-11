declare module "moment/min/moment-with-locales";
declare module "@typeform/embed";
declare module "*.gif";
declare module "*.png";
declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

type AsyncFuncReturnType<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : never;

type Subtract<T, V> = Pick<T, Exclude<keyof T, keyof V>>;
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type RemoveKeys<T, K extends Array<keyof T>> = Pick<
  T,
  Exclude<keyof T, K[keyof K]>
>;

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type RetrieveAsyncFunc<T extends (...args: any[]) => any> = ReturnType<
  T
> extends Promise<infer U>
  ? U
  : never;

type RequireProperty<T, P extends keyof T> = T & { [K in P]-?: T[P] };
type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

  