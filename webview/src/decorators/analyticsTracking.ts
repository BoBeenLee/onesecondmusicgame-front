import { firebaseLogEvent, IEventResult } from "src/configs/analytics";
import {
  createInjectDecorator,
  MakeData
} from "src/decorators/createInjectDecorator";

export function firebaseTracking<IProps, IStates>(
  getData: MakeData<IProps, IStates, IEventResult>
): any {
  const func = async (props: IProps, state: IStates, args: any[]) => {
    const data = await getData(props, state, args);
    firebaseLogEvent(data);
  };
  return createInjectDecorator(func);
}
