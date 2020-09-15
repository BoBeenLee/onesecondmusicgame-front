import {
  StoreReviewControllerApiFactory,
  StoreReviewWriteRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const storeReviewControllerApi = () =>
  StoreReviewControllerApiFactory(undefined, "", requestAPI());

export const hasWritenReviewBefore = async () => {
  const response = await storeReviewControllerApi().hasWritenReviewBefore();
  return response.data.body ?? false;
};

export const writeFeedback = async (
  storeReviewWriteRequest: StoreReviewWriteRequest
) => {
  const response = await storeReviewControllerApi().writeFeedback(
    storeReviewWriteRequest
  );
  return response.data.body!;
};
