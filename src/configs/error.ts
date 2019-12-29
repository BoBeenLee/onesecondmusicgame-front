import _ from "lodash";

export class OSMGError extends Error {
  constructor(props: any) {
    const { detail } = props;
    const primaryMessage = _.get(
      detail,
      [0, "message"],
      "알 수 없는 에러가 발생하였습니다."
    );

    super(primaryMessage);
  }
}
