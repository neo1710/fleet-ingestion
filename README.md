# High-Scale Energy Ingestion Engine

Backend service for ingesting and analyzing telemetry from smart meters and EV fleets.

Built with:
- NestJS
- PostgreSQL
- Prisma
- Docker

---

## System Overview

The platform receives two independent telemetry streams every 60 seconds:

### 1. Smart Meter (Grid Side)
Measures AC energy pulled from the grid.

{ meterId, kwhConsumedAc, voltage, timestamp }


### 2. Vehicle (Battery Side)
Measures DC energy delivered to the battery.

{ vehicleId, soc, kwhDeliveredDc, batteryTemp, timestamp }


Because AC must be converted to DC, some energy is lost.  
System efficiency is calculated as:

Efficiency = DC Delivered / AC Consumed


---

## Architecture

The system uses a **Hot + Cold data strategy**.

### Cold Store (Historical Tables)
Append-only tables for long-term analytics:

- `meter_history`
- `vehicle_history`

Characteristics:
- INSERT-only
- No updates or deletes
- Optimized for large-scale time-series data
- Indexed by `(deviceId, timestamp)`

This design supports **billions of records** without affecting write performance.

---

### Hot Store (Operational Tables)
Tables for fast dashboard reads:

- `meter_live`
- `vehicle_live`

Characteristics:
- One row per device
- Updated using UPSERT
- Always contains latest state

This avoids scanning large historical tables for current status.

---

## Data Flow

1. Device sends telemetry every 60 seconds.
2. Ingestion endpoint receives payload.
3. Data is:
   - INSERTED into history table.
   - UPSERTED into live table.

Incoming Data
↓
Ingestion API
↓
History Table (append-only)
+
Live Table (upsert latest state)


---

## API Endpoints

### Ingestion
POST /v1/ingest


Meter example:
```json
{
  "type": "meter",
  "meterId": "V1",
  "kwhConsumedAc": 10,
  "voltage": 220,
  "timestamp": "2026-02-08T10:00:00Z"
}
Vehicle example:

{
  "type": "vehicle",
  "vehicleId": "V1",
  "soc": 60,
  "kwhDeliveredDc": 8.5,
  "batteryTemp": 32,
  "timestamp": "2026-02-08T10:00:00Z"
}
Analytics
GET /v1/analytics/performance/:vehicleId
Returns 24-hour summary:

{
  "vehicleId": "V1",
  "totalAcConsumed": 120,
  "totalDcDelivered": 102,
  "efficiencyRatio": 0.85,
  "avgBatteryTemp": 31.5
}
Performance Considerations
Index Strategy
Historical tables use composite indexes:

(vehicleId, timestamp)
(meterId, timestamp)
This ensures:

24-hour queries use index range scans

No full table scans

Constant-time lookups for recent data

Scaling Strategy (14.4M Records/Day)
At 10,000 devices sending data every minute:

10,000 devices × 60 min × 24 hr = 14.4 million records/day
Future scaling strategies:

Time-based partitioning of history tables.

Horizontal scaling of ingestion services.

Message queue (Kafka) between ingestion and storage.

Read replicas for analytics.

Running the Project
Start the system
docker-compose up --build
Test ingestion
POST http://localhost:3000/v1/ingest
Test analytics
GET http://localhost:3000/v1/analytics/performance/V1
Tech Stack
NestJS (TypeScript)

PostgreSQL

Prisma ORM

Docker