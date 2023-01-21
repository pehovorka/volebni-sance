export interface Cell {
  id: number;
  prevId?: number;
  name: string;
  active: boolean;
  winning: boolean;
  odd: number;
  eventId: number;
  increasedOdd?: any;
  oppNumber: string;
  afterDateClosed: boolean;
}

export interface Box {
  id: string;
  prevId: string;
  name: string;
  namePosition: string;
  nameVisible: boolean;
  cells: Cell[];
}

export interface EventTable {
  id: string;
  prevId: string;
  name: string;
  extraEventTableDisplayStyle?: any;
  mySelectionId: string;
  columnDisplay: boolean;
  dateClosed?: any;
  boxes: Box[];
  countActiveOpp: number;
  cellsBreak: number[];
  maxColumns: number[];
  personalizable: boolean;
}

export interface EventTableGroup {
  id: number;
  groupKey: string;
  groupId: string;
  groupName: string;
  active: boolean;
  tableIds: string[];
}

export interface Match {
  id: number;
  name: string;
  nameFull: string;
  idCompetition: number;
  competitionAnnualId: number;
  tournamentTreeAvailable: boolean;
  nameCompetition: string;
  idSport: number;
  nameSport: string;
  idSuperSport: number;
  nameSuperSport: string;
  matchUrl: string;
  idLiveMatch: number;
  matchType: string;
  dateClosed: number;
  datetimeClosed: Date;
  dateStartOnTv: number;
  tvStationName?: any;
  specification?: any;
  detail?: any;
  homeParticipant?: any;
  visitingParticipant?: any;
  homeParticipantId?: any;
  visitingParticipantId?: any;
  homeParticipantImgURL: string;
  visitingParticipantImgURL: string;
  result?: any;
  resultParts?: any;
  countEventTables: number;
  betRadarMatchInfoURL?: any;
  stream: boolean;
  streamType?: any;
  analyzes: boolean;
  hasStatistics: boolean;
  eventTables: EventTable[];
  eventTableGroups: EventTableGroup[];
  oppRows: any[];
  oppRowsTableId?: any;
  interruptedInfo?: any;
  analyzesCount: number;
  commentCount: number;
  ticketArenaTicketsCount: number;
  evaluationRemark?: any;
  race: boolean;
  inMySelection: boolean;
  number: number;
  connectToLiveScore: boolean;
  withdrawalInfo?: any;
  tipbank: boolean;
  contestTileId?: any;
  survivorContestTileId?: any;
  communityStatsPlaceholder: string;
  showMilestones: boolean;
  sportRadarId?: any;
  sportRadarSwapParticipants: boolean;
  trackerType: string;
  isLiveMatchExistsWithStream: boolean;
}

export interface MatchNotifications {
  id: number;
  name: string;
  date: Date;
  available: boolean;
  active: boolean;
  inLiveOffer?: any;
  notificationEventList: any[];
}

export interface TipsportMatchResponse {
  match: Match;
  mySelectionEventTablesIds: any[];
  matchNotifications: MatchNotifications;
}
