-- schema.sql

CREATE TABLE shipments (
  id uuid PRIMARY KEY,
  booking_ref text UNIQUE,
  carrier_tracking_no text UNIQUE,
  sender_name text,
  sender_phone text,
  sender_address text,
  recipient_name text,
  recipient_phone text,
  recipient_address text,
  miles numeric,
  price_usd numeric,
  service_type text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
);

CREATE TABLE tracking_events (
  id serial PRIMARY KEY,
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE,
  carrier_tracking_no text,
  event_time timestamptz,
  location text,
  status_code text,
  description text,
  raw_payload jsonb,
  created_at timestamptz
);

CREATE TABLE webhook_logs (
  id serial PRIMARY KEY,
  provider text,
  raw_payload jsonb,
  received_at timestamptz,
  processed boolean DEFAULT false,
  error_message text
);

CREATE INDEX idx_ship_tracking_no ON shipments(carrier_tracking_no);
CREATE INDEX idx_events_shipment ON tracking_events(shipment_id);
