import { type BatteryData } from './BatteryData';
import { type PowerData } from './PowerData';

export interface SolarData {
    id: number;
    timestamp: string;
    command: string;
    commandDescription: string;
    inverterHeatSinkTemperature: number;
    busVoltage: number;
    isLoadOn: boolean;
    isChargingOn: boolean;
    isSccChargingOn: boolean;
    isAcChargingOn: boolean;
    isSwitchedOn: boolean;
    batteryData: BatteryData;
    powerData: PowerData;
}