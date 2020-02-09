import { firebaseLogEvent, IEventResult } from "@webview/configs/analytics";
import {
  createInjectDecorator,
  MakeData
} from "@webview/decorators/createInjectDecorator";

export function firebaseTracking<IProps, IStates>(
  getData: MakeData<IProps, IStates, IEventResult>
): any {
  const func = async (props: IProps, state: IStates, args: any[]) => {
    const data = await getData(props, state, args);
    firebaseLogEvent(data);
  };
  return createInjectDecorator(func);
}
