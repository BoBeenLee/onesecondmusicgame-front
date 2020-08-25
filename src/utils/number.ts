export const isNumber = (num: string) => Number.isInteger(Number(num));

export const defaultNumber = (num: string, defaultValue: number) => {
  return isNumber(num) ? Number(num) : defaultValue;
};
