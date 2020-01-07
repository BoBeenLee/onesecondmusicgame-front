import { EventType } from "../analytics";

// tslint:disable:object-literal-sort-keys
const events: { [key in EventType]: EventType } = {
  login: "login"
};

const eventsArray = Object.values(events);

describe("analytics", () => {
  it("validate event name length under 40", () => {
    eventsArray.map(event => {
      expect(event.length).toBeLessThanOrEqual(40);
    });
  });
});
