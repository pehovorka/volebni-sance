export enum Service {
  Tipsport = "tipsport",
}

export enum DataType {
  Bets = "bets",
}

export enum CollectionName {
  elections = "elections",
  electionRecords = "electionRecords",
}

export interface Election {
  id: string;
  active: boolean;
  displayed: boolean;
  name: string;
  dataSources: DataSource[];
}

export interface DataSource {
  eventId: string;
  service: Service;
  type: DataType;
}

export interface ElectionRecord {
  date: Date;
  service: Service;
  type: DataType;
  name: string;
  eventId: number;
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  odds: number;
  active?: boolean;
  winning?: boolean;
}

export interface Collections {
  [CollectionName.elections]: Election[];
  [CollectionName.electionRecords]: ElectionRecord[];
}
