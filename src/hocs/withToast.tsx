import hoistNonReactStatic from "hoist-non-react-statics";
import _ from "lodash";
import { Observer } from "mobx-react";
import React, { Component } from "react";

import Toast from "src/components/Toast";
import { getRootStore } from "src/stores/Store";

const withToast = <P extends object>(
  TargetComponent: React.ComponentType<P>
) => {
  class WithToast extends Component<P> {
    public render() {
      return (
        <React.Fragment>
          <TargetComponent {...this.props} />
          <Observer>
            {() =>
              _.map(getRootStore().toastStore.toasts, toast => {
                const { id, delay, message } = toast;
                return (
                  <Toast
                    key={id}
                    delay={delay}
                    message={message}
                    onFinish={_.partial(this.onFinish, id)}
                  />
                );
              })
            }
          </Observer>
        </React.Fragment>
      );
    }

    private onFinish = (id: string) => {
      const { dismissToast } = getRootStore().toastStore;
      dismissToast(id);
    };
  }
  hoistNonReactStatic(WithToast, TargetComponent);
  return WithToast;
};

export default withToast;
