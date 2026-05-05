export type FuelSessionState =
  | 'CREATED'
  | 'RISK_CHECKED'
  | 'AUTHORIZED'
  | 'PUMP_ENABLE_SENT'
  | 'PUMP_ENABLED'
  | 'FUELING'
  | 'FUELING_COMPLETED'
  | 'CAPTURED'
  | 'RECEIPTED'
  | 'CLOSED';

export interface SessionInput {
  stationId: string;
  pumpId: string;
  fuelGrade: 'GASOLINE_95' | 'DIESEL';
  limitValue: number;
}

export interface FuelSession {
  id: string;
  state: FuelSessionState;
  input: SessionInput;
}
