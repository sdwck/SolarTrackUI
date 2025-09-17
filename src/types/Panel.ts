import { type SolarData } from "./SolarData";
import { type PanelStatus } from "./PanelStatus";

export interface Panel {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    status: PanelStatus;
    currentPower: number;
    maxPower: number;
    efficiency: number;
    lastUpdate: string;
    solarData?: SolarData;
}