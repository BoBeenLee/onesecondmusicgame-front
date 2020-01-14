import { makeHmacSHA1 } from "../crypto";

describe("crypto test", () => {
  test("crypto hmac sha1 test", () => {
    expect(makeHmacSHA1("test", "Test")).toBe(
      "6c4f304e8dd4799e17504f92533b4a08d11be095"
    );
  });
});
