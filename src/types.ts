export interface Download {
  day: string;
  downloads: number;
}

export interface Maintainer {
  name: string;
  email: string;
}

export interface RelatedPackages {
  dependencies: string[];
  devDependencies: string[];
  peerDependencies: string[];
}

export interface PackageData {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  downloads: Download[];
  github: string | null;
  homepage: string | null;
  maintainers: Maintainer[];
  created: Date;
  modified: Date;
  contributors: number;
  related: RelatedPackages;
}

export interface ComparisonData {
  [key: string]: PackageData;
}