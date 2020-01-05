import _ from "lodash";

export enum ErrorCode {
  UNKOWN_ERROR = 0,
  FORBIDDEN_ERROR = 4001
}

interface IProps {
  status: number;
  body: string;
}

export class OSMGError extends Error {
  public status: number;

  constructor(props: IProps) {
    super(props.body);
    this.status = props.status;
  }
}
