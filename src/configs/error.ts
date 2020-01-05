import _ from "lodash";

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
