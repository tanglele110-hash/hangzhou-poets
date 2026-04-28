import type { Poet } from '../data';
import type { PositionedPoet } from '../types';
import {
  START_YEAR,
  END_YEAR,
  SCALE,
  COLUMN_WIDTH,
  PADDING_YEARS,
  MIN_HEIGHT_PX,
} from '../constants';

export function cardWidthForPoet(poet: Pick<Poet, 'weight'>): number {
  return poet.weight === 3 ? COLUMN_WIDTH + 12 : COLUMN_WIDTH;
}

export interface LayoutResult {
  positionedPoets: PositionedPoet[];
  totalColumnsWidth: number;
  timelineWidth: number;
  totalHeight: number;
}

export function computeLayout(poets: Poet[]): LayoutResult {
  const columns: number[] = [];
  const sortedPoets = [...poets].sort((a, b) => a.birth_year - b.birth_year);

  const preliminaryPoets = sortedPoets.map((poet) => {
    const minYears = (MIN_HEIGHT_PX[poet.weight] ?? MIN_HEIGHT_PX[1]) / SCALE;
    const contentEndYear = poet.birth_year + minYears;
    const effectiveEndYear =
      Math.max(poet.death_year, contentEndYear) + PADDING_YEARS;

    let colIndex = columns.findIndex((endYear) => endYear <= poet.birth_year);
    if (colIndex === -1) {
      colIndex = columns.length;
      columns.push(effectiveEndYear);
    } else {
      columns[colIndex] = effectiveEndYear;
    }
    return { ...poet, displayColumn: colIndex };
  });

  const columnWidths = columns.map((_, columnIndex) =>
    preliminaryPoets.reduce(
      (maxWidth, poet) =>
        poet.displayColumn === columnIndex
          ? Math.max(maxWidth, cardWidthForPoet(poet))
          : maxWidth,
      COLUMN_WIDTH,
    ),
  );

  const columnRightOffsets = columnWidths.reduce<number[]>(
    (offsets, _width, index) => {
      if (index === 0) {
        offsets.push(0);
      } else {
        offsets.push(offsets[index - 1] + columnWidths[index - 1]);
      }
      return offsets;
    },
    [],
  );

  const totalColumnsWidth = columnWidths.reduce((sum, w) => sum + w, 0);

  const positionedPoets: PositionedPoet[] = preliminaryPoets.map((poet) => ({
    ...poet,
    columnRightOffset: columnRightOffsets[poet.displayColumn],
    columnWidth: columnWidths[poet.displayColumn],
  }));

  const timelineWidth = Math.max(totalColumnsWidth + 450, 1000);
  const totalHeight = (END_YEAR - START_YEAR) * SCALE;

  return { positionedPoets, totalColumnsWidth, timelineWidth, totalHeight };
}

export function computeDecades(): number[] {
  const count = Math.floor((END_YEAR - START_YEAR) / 10) + 1;
  return Array.from({ length: count }, (_, i) => START_YEAR + i * 10);
}
