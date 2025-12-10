// pages/api/track.js
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { number } = req.query;
  if (!number) return res.status(400).json({ error: 'number required' });

  try {
    const q = await db.query(
      `SELECT * FROM shipments WHERE carrier_tracking_no = $1 OR booking_ref = $1 LIMIT 1`,
      [number]
    );
    if (q.rowCount === 0) return res.status(404).json({ error: 'shipment not found' });
    const shipment = q.rows[0];

    const eventsQ = await db.query(`SELECT * FROM tracking_events WHERE shipment_id = $1 ORDER BY event_time ASC`, [shipment.id]);
    const events = eventsQ.rows;

    return res.json({ shipment, events });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
