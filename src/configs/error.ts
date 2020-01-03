import _ from "lodash";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail: any;
}

export class OSMGError extends Error {
  constructor(props: IProps) {
    const { detail } = props;
    const primaryMessage = _.get(
      detail,
      [0, "message"],
      "알 수 없는 에러가 발생하였습니다."
    );

    super(primaryMessage);
  }
}
