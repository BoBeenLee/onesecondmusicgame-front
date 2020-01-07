describe("common 1test", () => {
  test("common test", () => {
    const func: any = null;
    expect("test").toEqual("test");
    expect(func?.test(10)).toEqual(undefined);
  });
});

export {};
