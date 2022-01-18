import { Polygon } from "fabric/fabric-impl";
import { Hex } from "honeycomb-grid";

export type MyHex = Hex<{ ownerId: string; polygon: Polygon | null }>;
