export interface PostSearchState {
  keyword: string;
  setKeyword: (keyword: string) => void;
  clearSearch: () => void;
  hasActiveSearch: boolean;
}

export interface SearchParamsUpdate {
  keyword?: string;
  page?: number;
  size?: number;
}
