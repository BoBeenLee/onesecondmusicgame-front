import { cachedMemoize, deepMemoize } from "../memoize";

const add = ({ a, b }: { a: number; b: number }) => {
  return Promise.resolve(a + b);
};

const cachedAddMemoize = cachedMemoize(add);
const cachedAddMemoize2 = deepMemoize<any, Promise<number>>(add);

describe("memoize", () => {
  it("memoize2 test", async () => {
    expect(await cachedAddMemoize2({ a: 1, b: 2 })).toEqual(
      await cachedAddMemoize2({ a: 1, b: 2 })
    );
  });
});
