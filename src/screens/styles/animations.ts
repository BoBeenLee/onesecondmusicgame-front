import { Platform } from "react-native";

// tslint:disable:object-literal-sort-keys
export const pushTransition =
  Platform.OS === "android"
    ? {
        push: {
          content: {
            x: {
              from: 2000,
              to: 0,
              duration: 380
            }
          },
          waitForRender: true
        },
        pop: {
          content: {
            x: {
              from: 0,
              to: 2000,
              duration: 400
            }
          }
        }
      }
    : { push: { waitForRender: true } };

export const fadeTransition =
  Platform.OS === "android"
    ? {
        pop: {
          content: {
            alpha: {
              duration: 300,
              from: 1,
              to: 0
            }
          }
        },
        push: {
          content: {
            alpha: {
              duration: 300,
              from: 0,
              to: 1
            }
          },
          waitForRender: true
        }
      }
    : { push: { waitForRender: true } };
