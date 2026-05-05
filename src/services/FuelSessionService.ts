import { FuelSession, FuelSessionState, SessionInput } from '../types/session';

const FLOW: FuelSessionState[] = [
  'CREATED',
  'RISK_CHECKED',
  'AUTHORIZED',
  'PUMP_ENABLE_SENT',
  'PUMP_ENABLED',
  'FUELING',
  'FUELING_COMPLETED',
  'CAPTURED',
  'RECEIPTED',
  'CLOSED'
];

export class FuelSessionService {
  private readonly sessions = new Map<string, FuelSession>();

  async createSession(input: SessionInput): Promise<FuelSession> {
    const id = `sess_${Date.now()}`;
    const session: FuelSession = { id, input, state: 'CREATED' };
    this.sessions.set(id, session);
    return session;
  }

  async advanceSession(sessionId: string): Promise<FuelSession> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const currentIndex = FLOW.indexOf(session.state);
    const nextState = FLOW[Math.min(currentIndex + 1, FLOW.length - 1)];

    const updated: FuelSession = { ...session, state: nextState };
    this.sessions.set(sessionId, updated);
    return updated;
  }
}
