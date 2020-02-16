import Moment, { duration, MomentInput } from "moment";
import moment from "moment/min/moment-with-locales";

const DEFAULT_FORMAT = "YYYY.MM.DD";
export const DEFAULT_HH_MM_SS_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

const DATE_FORMAT_MAP = new Map().set("M", "개월").set("D", "일");

moment.locale("ko");

export const transformDateToString = (
  date: Date | string | number,
  format: string = DEFAULT_FORMAT
): string => {
  return moment(date).format(format);
};

export const transformStringToMoment = (
  date: string,
  format: string = DEFAULT_FORMAT
): Moment.Moment => {
  return moment(date, format);
};

export const transformMomentToString = (
  targetMoment: Moment.Moment,
  format: string = DEFAULT_FORMAT
): string => {
  return targetMoment.format(format);
};

export const transformTimeToString = (
  time: number | string,
  format: string = DEFAULT_FORMAT
) => {
  return transformDateToString(new Date(Number(time)), format);
};

export const today = (): Moment.Moment => {
  return moment();
};

export const dayDuration = (
  startMoment: Moment.Moment,
  endMoment: Moment.Moment
) => {
  return duration(endMoment.diff(startMoment)).asDays();
};

export const dayDateDuration = (
  startDate: Date | string | number,
  endDate: Date | string | number
) => {
  return dayDuration(moment(startDate), moment(endDate));
};

export const secondsDuration = (
  startDate: Moment.Moment | Date | string | number,
  endDate: Moment.Moment | Date | string | number
) => {
  return duration(moment(endDate).diff(moment(startDate))).asSeconds();
};

export const isBetween = (
  targetAt: Moment.Moment,
  startedAt: Moment.Moment,
  endedAt: Moment.Moment
) => {
  return targetAt.isBetween(startedAt, endedAt);
};

export const isTodayBetween = (startedAt: number, endedAt: number): boolean => {
  return today().isBetween(startedAt, endedAt);
};

export const isTodaySameBetween = (
  startedAt: number,
  endedAt: number
): boolean => {
  return today().isBetween(startedAt, endedAt, undefined, "[]");
};

export const isSameOrAfter = (
  targetAt: Moment.Moment,
  afterAt: Moment.Moment
) => {
  return targetAt.isSameOrAfter(afterAt);
};

export const isSameOrBefore = (
  targetAt: Moment.Moment,
  beforeAt: Moment.Moment
) => {
  return targetAt.isSameOrBefore(beforeAt);
};

export const isTodayAfter = (input: MomentInput) => {
  return today().isAfter(input);
};

export const isTodayBefore = (input: MomentInput) => {
  return today().isBefore(input);
};

export const transformKoreanFormat = (date: string) => {
  const format = date.slice(-1);
  const numberOfDate = parseInt(date, 10);

  if (/\w/.test(format) && !Number.isNaN(numberOfDate)) {
    return `${numberOfDate} ${DATE_FORMAT_MAP.get(format)}`;
  }

  return date;
};
