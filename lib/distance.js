//Distance helper: uses Google Distance Matrix if API key provided and both origins/destinations are addresses (string). Otherwise uses haversine when lat/lng provided.
// lib/distance.js
import fetch from 'node-fetch';

const toRad = (deg) => deg * Math.PI / 180;
const earthMiles = 3958.8;

export async function distanceMiles({ origin, destination, originCoords, destCoords }) {
  // If GOOGLE_MAPS_API_KEY present and origin/destination are strings, use Distance Matrix API
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (key && origin && destination) {
    const o = encodeURIComponent(origin);
    const d = encodeURIComponent(destination);
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${o}&destinations=${d}&key=${key}`;
    try {
      const res = await fetch(url);
      const j = await res.json();
      if (j.status === 'OK' && j.rows?.[0]?.elements?.[0]?.status === 'OK') {
        // distance in meters in metric responses, but we requested imperial: value is in meters still, but distance.value is meters
        const meters = j.rows[0].elements[0].distance.value;
        const miles = meters / 1609.344;
        return miles;
      }
    } catch (e) {
      console.warn('Distance Matrix failed, falling back to haversine', e);
    }
  }

  // Haversine fallback using coords (must exist)
  const oC = originCoords;
  const dC = destCoords;
  if (oC && dC && typeof oC.lat === 'number' && typeof dC.lat === 'number') {
    const lat1 = oC.lat, lon1 = oC.lng, lat2 = dC.lat, lon2 = dC.lng;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const miles = earthMiles * c;
    return miles;
  }

  throw new Error('Unable to compute distance: provide GOOGLE_MAPS_API_KEY or lat/lng coords');
}
