// pages/index.js
import Link from 'next/link';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <main className="max-w-3xl w-full p-6 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-2">Crownfit Logistics — Book & Track</h1>
        <p className="mb-6">Request pickup, delivery or end-to-end logistics within Texas. Track shipments by Air Way Bill or Bill of Lading.</p>
        <div className="flex gap-4">
          <Link href="/book" className="px-4 py-2 bg-blue-600 text-white rounded">Create Booking</Link> {/*Top*/}
          <Link href="/track" className="px-4 py-2 border rounded">Track Shipment</Link> {/*Bottom*/}
        </div>
      </main>
    </div>
  );
}
