import { KANDIDAT, UCAST } from "./volbyCz";

export enum Service {
  Tipsport = "tipsport",
}

export enum DataType {
  Bets = "bets",
}

export enum CollectionName {
  Elections = "elections",
  ElectionRecords = "electionRecords",
  ElectionResultRecords = "electionResultRecords",
}

export interface Election {
  id: string;
  active: boolean;
  displayed: boolean;
  name: string;
  dataSources: DataSource[];
}

export interface DataSource {
  eventId: number;
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
  [CollectionName.Elections]: Election[];
  [CollectionName.ElectionRecords]: ElectionRecord[];
}

export interface ElectionResultRecord {
  date: Date;
  participation?: UCAST["_attributes"];
  candidates: KANDIDAT["_attributes"][];
}
