export interface TgpDocumentReaderProfileData {
  'Date of Birth': string;
}

export interface TgpDocumentReaderAuthenticityDetails {
  docType: number;
  expiry: number;
  imageQA: number;
  mrz: number;
  overallStatus: number;
  pagesCount: number;
  security: number;
  text: number;
  vds: number;
}

export interface TgpDocumentReaderImages {
  Portrait: string;
  "Document front side": string;
}

export interface TgpDocumentReaderResponse {
  profileData: TgpDocumentReaderProfileData;
  images: TgpDocumentReaderImages;
  authenticityDetails: TgpDocumentReaderAuthenticityDetails;
}
