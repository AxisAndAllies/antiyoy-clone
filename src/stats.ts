export enum UnitType {
  PEASANT,
  SPEARMAN,
  BARON,
  KNIGHT,
}

export const Stat = {
  [UnitType.PEASANT]: {
    cost: 10,
    upkeep: 2,
    strength: 1,
    protection: 1,
  },
  [UnitType.SPEARMAN]: {
    cost: 20,
    upkeep: 6,
    strength: 2,
    protection: 2,
  },
  [UnitType.BARON]: {
    cost: 30,
    upkeep: 18,
    strength: 3,
    protection: 3,
  },
  [UnitType.KNIGHT]: {
    cost: 40,
    upkeep: 36,
    strength: 2,
    protection: 2,
  },
};
