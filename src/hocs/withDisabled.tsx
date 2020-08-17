import hoistNonReactStatic from "hoist-non-react-statics";
import _ from "lodash";
import React, { Component } from "react";

type IProps = {
  componentId: string;
};

export type DisabledProps = {
  disabledProps: {
    isDiabledUniqueId: (uniqueId: string) => boolean;
    wrapperDisabled: (func: any, uniqueId?: string) => any;
  };
};

const withDisabled = <T extends DisabledProps, P>(
  TargetComponent: React.ComponentType<T> & P
) => {
  class WithDisabled extends Component<T & IProps> {
    public disabledUniqueIds: { [key in string]: boolean };

    constructor(props: T & IProps) {
      super(props);
      this.disabledUniqueIds = {};
    }

    public render() {
      return (
        <TargetComponent
          {...(this.props as any)}
          disabledProps={this.disabledProps}
        />
      );
    }

    private get disabledProps() {
      return {
        wrapperDisabled: this.wrapperDisabled,
        isDiabledUniqueId: this.isDiabledUniqueId
      };
    }

    private wrapperDisabled = (
      func: any,
      uniqueId: string = _.uniqueId("disabled")
    ) => {
      this.disabledUniqueIds[uniqueId] = false;
      return async (...args: any[]) => {
        const disabled = this.disabledUniqueIds[uniqueId];
        if (disabled) {
          return;
        }
        this.disabledUniqueIds[uniqueId] = true;
        try {
          return await func(...args);
        } finally {
          this.disabledUniqueIds[uniqueId] = false;
        }
      };
    };

    private isDiabledUniqueId = (uniqueId: string) => {
      return Boolean(this.disabledUniqueIds[uniqueId]);
    };
  }

  return hoistNonReactStatic(WithDisabled, TargetComponent);
};

export default withDisabled;
