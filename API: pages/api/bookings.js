// pages/api/bookings.js
import db from '../../lib/db';
import { distanceMiles } from '../../lib/distance';
import { calculatePrice } from '../../utils/pricing';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = req.body;
  try {
    // basic validation
    if (!body.sender || !body.recipient) return res.status(400).json({ error: 'sender and recipient required' });

    // compute distance: prefer Google Distance Matrix (by addresses) or fallback to coords
    const miles = await distanceMiles({
      origin: body.sender.address,
      destination: body.recipient.address,
      originCoords: body.sender.coords,
      destCoords: body.recipient.coords
    });

    const price = calculatePrice({ miles });

    const booking_ref = 'LGX-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random()*9000+1000);
    const shipment_id = uuidv4();
    // generate a fake AWB/BOL for MVP — pattern: AWB-XXXX-###### (you can replace with real carrier number)
    const carrier_tracking_no = `AWB-${Math.floor(100+Math.random()*900)}-${Math.floor(100000+Math.random()*900000)}`;

    // insert addresses and shipment into DB (simple)
    await db.query(
      `INSERT INTO shipments(id, booking_ref, carrier_tracking_no, sender_name, sender_phone, sender_address, recipient_name, recipient_phone, recipient_address, miles, price_usd, service_type, status, created_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, NOW())`,
      [shipment_id, booking_ref, carrier_tracking_no, body.sender.name, body.sender.phone, body.sender.address, body.recipient.name, body.recipient.phone, body.recipient.address, miles, price, body.service_type || 'end_to_end', 'created']
    );

    return res.status(201).json({ booking_ref, shipment_id, carrier_tracking_no, miles, price_usd: price });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
