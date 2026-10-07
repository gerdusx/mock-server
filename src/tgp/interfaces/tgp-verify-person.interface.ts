export interface TgpVerifyPersonSAFPSResults {
  FirstName: string;
  Surname: string;
  BirthDate: string;
  Filings: any;
}

export interface TgpVerifyPersonGoldenSource {
  OnNPR: boolean;
  OnHANIS: boolean;
  DateOfMarriage: string;
  DateOfMarriageEpoch: number;
  MaritalStatus: string;
  DateOfDeath: string;
  DateOfDeathEpoch: number;
  IdBlocked: boolean;
  DeadIndicator: boolean;
  IdSeqNo: string;
  IdIssueDate: string;
  IdIssueDateEpoch: number;
  SmartCardIssued: boolean;
  Surname: string;
  Name: string;
  IdNumber: number;
  TransactionNo: string;
  DhaTransactionNo?: string;
  BirthPlaceCountryCode: string;
  BirthPlaceCountry: string;
  ErrorCode: number;
  Error: string;
  SAFPSResults: TgpVerifyPersonSAFPSResults[];
  Photo: string;
}

export interface TgpVerifyPersonResponse {
  GoldenSource: TgpVerifyPersonGoldenSource;
  OfflineCacheResult: string;
  CacheResult: boolean;
  SCDerivedValues: any;
  CacheDate: string;
  RequestedBy: string;
  AuthorizedBy: string;
  CRef: string;
  Status: string;
  Message: string;
}
