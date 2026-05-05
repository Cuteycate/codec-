import { FuelSession, SessionInput } from '../types/session';

const API_BASE_URL = 'http://localhost:8080/v1';

export class FuelApiClient {
  async createSession(input: SessionInput): Promise<FuelSession> {
    const response = await fetch(`${API_BASE_URL}/fuel-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!response.ok) throw new Error(`createSession failed: ${response.status}`);
    return response.json();
  }

  async enablePump(sessionId: string): Promise<FuelSession> {
    const response = await fetch(`${API_BASE_URL}/fuel-sessions/${sessionId}/enable-pump`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error(`enablePump failed: ${response.status}`);
    return response.json();
  }

  async finalizeSession(sessionId: string): Promise<FuelSession> {
    const response = await fetch(`${API_BASE_URL}/fuel-sessions/${sessionId}/finalize`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error(`finalizeSession failed: ${response.status}`);
    return response.json();
  }
}
