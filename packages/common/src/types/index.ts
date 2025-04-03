export interface Package {
  name: string;
  version: string;
}

export interface Documentation {
  package: string;
  version: string;
  content: string;
}
