import type { Poet } from '../data';

export interface PositionedPoet extends Poet {
  displayColumn: number;
  columnRightOffset: number;
  columnWidth: number;
}

export interface Period {
  name: string;
  start: number;
  end: number;
  color: string;
}

export interface HistoricalEvent {
  name: string;
  start: number;
  end: number;
  yOffset?: number;
}

export interface TagGroup {
  prefix: string;
  tags: string[];
}

export interface Relationship {
  source: string;
  target: string;
  label: string;
}
