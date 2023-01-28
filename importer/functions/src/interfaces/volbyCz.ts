export interface Attributes {
  version: string;
  encoding: string;
}

export interface Declaration {
  _attributes: Attributes;
}

export interface Attributes2 {
  xmlns: string;
  "xmlns:xsi": string;
  "xsi:schemaLocation": string;
  DATUM_CAS_GENEROVANI: Date;
}

export interface Attributes3 {
  PORADOVE_CISLO: string;
  JMENO: string;
  PRIJMENI: string;
  TITULPRED: string;
  TITULZA: string;
  HLASY_1KOLO: string;
  HLASY_PROC_1KOLO: string;
  HLASY_2KOLO?: string;
  HLASY_PROC_2KOLO?: string;
}

export interface KANDIDAT {
  _attributes: Attributes3;
}

export interface Attributes4 {
  KOLO: string;
  OKRSKY_CELKEM: string;
  OKRSKY_ZPRAC: string;
  OKRSKY_ZPRAC_PROC: string;
  ZAPSANI_VOLICI: string;
  VYDANE_OBALKY: string;
  UCAST_PROC: string;
  ODEVZDANE_OBALKY: string;
  PLATNE_HLASY: string;
  PLATNE_HLASY_PROC: string;
}

export interface UCAST {
  _attributes: Attributes4;
}

export interface CR {
  KANDIDAT: KANDIDAT[];
  UCAST: UCAST[];
}

export interface Results {
  _attributes: Attributes2;
  CR: CR;
}

export interface ResultsResponse {
  _declaration: Declaration;
  VYSLEDKY: Results;
}
