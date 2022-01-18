export enum UnitType {
  PEASANT,
  SPEARMAN,
  BARON,
  KNIGHT,
  CASTLE,
  FARM,
  TOWER,
  STRONG_TOWER,
}
// Any unit can move up to 4 hexes in a turn,
// provided that all but the last hex are their own Province.

export const canMove = (unitType: UnitType) => {
  return [
    UnitType.PEASANT,
    UnitType.SPEARMAN,
    UnitType.BARON,
    UnitType.KNIGHT,
  ].includes(unitType);
};

export type Stat = {
  cost: number; // base cost
  strength: number;
  protection: number;
  income: number;
};

export const Stats: Record<string, Stat> = {
  [UnitType.PEASANT]: {
    cost: 10,
    income: -2,
    strength: 1,
    protection: 1,
  },
  [UnitType.SPEARMAN]: {
    cost: 20,
    income: -6,
    strength: 2,
    protection: 2,
  },
  [UnitType.BARON]: {
    cost: 30,
    income: -18,
    strength: 3,
    protection: 3,
  },
  [UnitType.KNIGHT]: {
    cost: 40,
    income: -36,
    strength: 4,
    protection: 3,
  },
  [UnitType.CASTLE]: {
    cost: 0,
    strength: 0,
    protection: 1,
    income: 0,
  },
  [UnitType.FARM]: {
    cost: 12, // + 2 per farm
    strength: 0,
    protection: 1,
    income: 4,
  },
  [UnitType.TOWER]: {
    cost: 15,
    strength: 0,
    protection: 2,
    income: -1,
  },
  [UnitType.STRONG_TOWER]: {
    cost: 0,
    strength: 0,
    protection: 3,
    income: 6,
  },
};
