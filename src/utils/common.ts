import _ from "lodash";

export const enhanceNoError = (func: any) => async (...args: any[]) => {
  try {
    return await func(...args);
  } catch (error) {
    // NOTHING
  }
};

export function delay(seconds = 500) {
  return new Promise((resolve, __) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}

export function isJSON(str: string) {
  try {
    const obj = JSON.parse(str);
    if (obj && typeof obj === "object" && obj !== null) {
      return true;
    }
  } catch (err) {
    // NOTHING
  }
  return false;
}

export const getValue = <T>(func: () => T, defaultValue: T) => {
  try {
    return func();
  } catch (error) {
    return defaultValue;
  }
};

export const filterNull = <T>(iterable: Array<T | null> | null) => {
  if (!iterable) {
    return [];
  }
  return _.filter(iterable, i => i !== null) as T[];
};

export const filterEmpty = <T>(
  iterable: Array<T | null | undefined> | null | undefined
) => {
  if (!iterable) {
    return [];
  }
  return _.filter(
    iterable,
    i => i !== null && i !== undefined && (i as any) !== ""
  ) as T[];
};
