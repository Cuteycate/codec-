# Mobile Fueling App Blueprint (GS Caltex-style) — Full Flow

## 1) Product Goal
Enable drivers to discover a station, authorize payment, unlock a pump, fuel, and receive receipts/rewards in under 90 seconds from app open to nozzle start.

## 2) End-to-End User Flows

### 2.1 Primary Flow (Happy Path)
1. User opens app and passes biometric unlock.
2. App auto-detects nearby station using geofence + GPS and fetches live pump availability.
3. User selects pump by QR/NFC scan (fallback: manual pump number input).
4. User confirms fuel type + limit (full tank or fixed amount).
5. App runs risk check and payment pre-authorization.
6. Backend sends `ENABLE_PUMP` command to forecourt controller.
7. Pump status changes to ready; app displays "Start fueling".
8. User lifts nozzle and fuels.
9. Pump finalizes amount/volume and posts completion event.
10. Backend captures payment, awards loyalty points, and generates receipt.
11. User sees success screen with receipt, points, and quick actions.

### 2.2 Failure & Recovery Flows
- **Payment auth failed:** user changes payment method or lowers limit; session remains editable.
- **Pump command timeout:** retry command once, then failover to station-attendant handoff mode.
- **User leaves geofence mid-session:** block new session creation; allow completion of active fueling only.
- **Capture failed after fueling:** mark as `REVERSAL_PENDING`, trigger automatic retry + support alert.
- **Controller offline:** block start and show nearest alternate stations.

### 2.3 Post-Fueling Flows
- Download/share receipt (PDF).
- Submit business tax invoice details.
- Rate station experience.
- One-tap repeat at favorite station.

## 3) MVP Scope (Build First)
- Account login: phone OTP + Apple/Google + optional biometric lock.
- Station locator with realtime fuel prices and pump availability.
- Pump selection: QR/NFC/manual.
- Fuel session creation + pre-auth + pump enable.
- Session completion + payment capture + digital receipt.
- Basic loyalty: earn/redeem points and apply coupons.
- Push notifications for every major session event.
- Support: in-app "Report issue" attached to session ID.

## 4) V2+ Scope (After Pilot)
- Fleet mode with driver limits and centralized billing.
- Membership tiers and dynamic discounts.
- Car profile auto-fill (preferred fuel, plate, tax profile).
- Car wash / convenience add-ons in same checkout.
- Predictive recommendations for cheapest nearby fill-up windows.

## 5) System Architecture

### 5.1 Mobile App
- React Native or Flutter + native bridges for NFC, BLE, and geofencing.
- Local encrypted storage for access tokens and session cache.
- Offline-safe session resume screen (read-only if network lost).

### 5.2 Backend Services
- **API Gateway:** authn/authz, rate limit, request signatures.
- **Identity Service:** OTP/social login, token issuance, device binding.
- **Station Service:** stations, fuel prices, pump status.
- **Fuel Session Service:** state machine orchestration and idempotency.
- **Forecourt Adapter Service:** controller protocol normalization.
- **Payment Service:** pre-auth/capture/reversal.
- **Loyalty Service:** points + coupon ledger.
- **Receipt Service:** receipt + tax invoice generation.
- **Notification Service:** push/SMS/email event fanout.

### 5.3 Data & Events
- Event bus topics: `session.created`, `session.authorized`, `pump.enabled`, `fueling.started`, `fueling.completed`, `payment.captured`, `receipt.generated`, `session.failed`.
- Analytics pipeline for conversion funnel and operational latency.

## 6) Full Session State Machine
`CREATED -> RISK_CHECKED -> AUTHORIZED -> PUMP_ENABLE_SENT -> PUMP_ENABLED -> FUELING -> FUELING_COMPLETED -> CAPTURED -> RECEIPTED -> CLOSED`

### Failure States
- `AUTH_FAILED`
- `PUMP_ENABLE_TIMEOUT`
- `ABORTED_BY_USER`
- `CONTROLLER_UNAVAILABLE`
- `CAPTURE_FAILED`
- `REVERSAL_PENDING`

### Rules
- All command endpoints must be idempotent via `Idempotency-Key`.
- Illegal transitions return `409 CONFLICT` with current state.
- Session TTL: 15 minutes pre-fueling, 30 minutes post-fueling resolution window.

## 7) API Contract (MVP)

### 7.1 Session Creation
`POST /v1/fuel-sessions`
```json
{
  "stationId": "st_001",
  "pumpId": "p_08",
  "fuelGrade": "GASOLINE_95",
  "limitType": "AMOUNT",
  "limitValue": 70.00,
  "currency": "USD",
  "paymentMethodId": "pm_123"
}
```

### 7.2 Enable Pump
`POST /v1/fuel-sessions/{sessionId}/enable-pump`

### 7.3 Complete & Capture
`POST /v1/fuel-sessions/{sessionId}/finalize`

### 7.4 Query Status
`GET /v1/fuel-sessions/{sessionId}`

### 7.5 Webhooks from Forecourt Adapter
- `POST /v1/webhooks/forecourt/fueling-started`
- `POST /v1/webhooks/forecourt/fueling-completed`

## 8) Security & Compliance Checklist
- PCI DSS scope reduction through payment tokenization.
- mTLS between core services and forecourt adapter.
- Signed webhooks + replay window validation.
- Device fingerprint + velocity checks for fraud.
- PII encryption at rest, TLS 1.2+ in transit.
- Immutable audit logs for financial and pump actions.
- Configurable retention and data subject deletion workflows.

## 9) Operational SLOs
- Session creation p95 < 800ms.
- Pump enable command acknowledgment p95 < 2.5s.
- End-to-end success rate > 98.5%.
- False fraud-block rate < 0.2%.
- Receipt generation p95 < 1.0s after capture.

## 10) Pilot Rollout Plan (12 Weeks)
- **Weeks 1-2:** partner alignment, protocol mapping, compliance sign-off.
- **Weeks 3-4:** implement auth, station, and session services.
- **Weeks 5-6:** forecourt adapter + payment sandbox integration.
- **Weeks 7-8:** mobile app MVP flows + QA automation.
- **Weeks 9-10:** controlled pilot (5-10 stations), on-site monitoring.
- **Weeks 11-12:** stabilization, KPI review, phased production expansion.

## 11) Definition of Done for “Full Flow Complete”
A release is complete only when all items pass:
1. User can start to finish fueling from app without station-attendant intervention.
2. Payment auth + capture + receipt succeeds for Visa/Mastercard and one local wallet.
3. Loyalty earn/redeem works in the same transaction.
4. Failure flows are recoverable with clear UI messaging.
5. Observability dashboards show conversion, latency, and failure reasons by station.
6. Support can search any session by phone, plate hash, or session ID.

## 12) Immediate Build Plan (Start Now)
1. Create API schemas in OpenAPI for session and webhook endpoints.
2. Build session state machine service with idempotent transition handlers.
3. Integrate one forecourt controller in a staging station.
4. Ship mobile flow: station -> pump -> authorize -> fuel -> receipt.
5. Run pilot with synthetic and live transactions, then harden for scale.
