export type PortfolioAppreciation = {
  available: true;
  count: number;
  appreciated: boolean;
};

export type PortfolioAppreciationUnavailable = {
  available: false;
};

export type PortfolioAppreciationResponse =
  | PortfolioAppreciation
  | PortfolioAppreciationUnavailable;
