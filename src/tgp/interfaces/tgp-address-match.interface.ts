export interface TgpAddressMatchConsumerDetail {
  DisplayText: string;
}

export interface TgpAddressMatchConsumer {
  ConsumerDetail: TgpAddressMatchConsumerDetail;
}

export interface TgpAddressMatchResponse {
  Consumer: TgpAddressMatchConsumer;
}
