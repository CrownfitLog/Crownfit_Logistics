//Accept carrier webhook updates (POST)- match by carrier_tracking_no and insert event.
// pages/api/webhooks/carrier.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const payload = req.body; // expect { tracking_no, status, location, timestamp, description }
  try {
    const { tracking_no, status, location, timestamp, description } = payload;
    if (!tracking_no) return res.status(400).json({ error: 'tracking_no required' });

    // find shipment
    const s = await db.query(`SELECT id FROM shipments WHERE carrier_tracking_no = $1 LIMIT 1`, [tracking_no]);
    if (s.rowCount === 0) {
      // optionally store in webhook_logs table for later matching
      await db.query(`INSERT INTO webhook_logs(provider, raw_payload, received_at, processed) VALUES($1,$2,NOW(),false)`, ['unknown', JSON.stringify(payload)]);
      return res.status(202).json({ status: 'queued' });
    }
    const shipment_id = s.rows[0].id;
    const event_time = timestamp ? new Date(timestamp) : new Date();

    await db.query(`INSERT INTO tracking_events (shipment_id, carrier_tracking_no, event_time, location, status_code, description, raw_payload, created_at)
                    VALUES($1,$2,$3,$4,$5,$6,$7,NOW())`,
                   [shipment_id, tracking_no, event_time, location || null, status || null, description || null, JSON.stringify(payload)]);

    // option: update shipment status
    if (status) {
      await db.query(`UPDATE shipments SET status = $1, updated_at = NOW() WHERE id = $2`, [status, shipment_id]);
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
