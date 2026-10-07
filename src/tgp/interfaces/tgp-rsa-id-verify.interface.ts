export interface TgpRsaIdVerifyFaceResult {
  isIdentical: boolean;
  confidence: number;
}

export interface TgpRsaIdVerifySafpsResult {
  FirstName: string | null;
  Surname: string | null;
  BirthDate: string | null;
  Filings: any | null;
}

export interface TgpRsaIdVerifyResponseData {
  TrackingNumber: string;
  CachedResult: boolean;
  CacheDate: string | null;
  FirstNameResult: string;
  LastNameResult: string;
  IdNumber: string;
  FaceResult: TgpRsaIdVerifyFaceResult | null;
  LivenessResult: any | null;
  SAFPSResults: TgpRsaIdVerifySafpsResult[];
  FirstName: string;
  LastName: string;
  SmartCardIssued: boolean;
  IDIssueDate: string;
  IDSequenceNumber: string;
  DeadIndicator: boolean;
  DateOfDeath: string | null;
  IDBlocked: boolean;
  MaritalStatus: string;
  DateOfMarriage: string | null;
  OnHanis: boolean;
  OnNPR: boolean;
  BirthPlaceCountryCode: string;
  BirthPlaceCountry: string;
  FacialImageAvailable: boolean;
  FacialImage: string | null;
  SCDerivedValues: any | null;
  IsWalletCreated: boolean;
  CRef: string;
  Status: string;
  Message: string;
}

export interface TgpRsaIdVerifyResponse {
  response: TgpRsaIdVerifyResponseData;
  type: string | null;
  title: string;
  status: number;
  detail: string;
  instance: string;
}
