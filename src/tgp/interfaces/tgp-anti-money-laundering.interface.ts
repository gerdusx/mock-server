export interface TgpAntiMoneyLaunderingResponse {
  Status: string;
  ResponseInfo: {
    ApplicationId: number;
    SolutionSetInstanceId: string;
    CurrentQueue: string;
  };
  Fields: {
    Applicants_IO: {
      Applicant: Array<{
        Attributes: {
          DSWatchlistVerification: {
            NmResults: TgpAntiMoneyLaunderingNmResult[];
            PepResults: TgpAntiMoneyLaunderingPepResult[];
            WlsResults: TgpAntiMoneyLaunderingWatchlistResult[];
          };
          DRWatchlistVerification: {
            MatchCount: number;
            ResponseSize: number;
            APIResponseTime: string;
            TimeOfRequest: string;
            ServiceTime: number;
            WatchlistDecision: string;
          };
          DSWatchlistMonitor: unknown;
        };
        DSWatchlistVerificationStatus: {
          IsSuccess: boolean;
          Outcome: string;
        };
      }>;
    };
    ApplicationData_IO: Record<string, unknown>;
  };
}

export interface TgpAntiMoneyLaunderingNmResult {
  articleDate: string;
  category: string;
  score: number;
  articleTitle: string;
  subjectMatched?: string;
  text?: string;
  url?: string;
}

export interface TgpAntiMoneyLaunderingPepResult {
  name: string;
  score: number;
  pepsSearchType: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  aliases: string[];
  country?: string | null;
  birthName?: string | null;
  nativeName?: string | null;
  address: string[];
  familyMembers: Array<{ name: string; relationType: string }>;
  social: Array<{ name: string; relationType: string }>;
  professionalHistory: string[];
  convicted: string[];
  memberOf: string[];
  employer: string[];
  affiliation: string[];
  businessRelations: string[];
  businessPartnerships: string[];
  lobbying: string[];
  stakeholder: string[];
  contributions: string[];
}

export interface TgpAntiMoneyLaunderingWatchlistResult {
  sourceAgencyName: string;
  score: number;
  category: string;
  sourceListType: string;
  sourceRegion: string;
  subjectMatched: string;
  url?: string;
  highlights?: string[];
  text?: string;
  articleTitle?: string;
}
