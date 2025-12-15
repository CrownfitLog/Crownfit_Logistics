// pages/index.js
import Link from 'next/link';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <main className="max-w-3xl w-full p-6 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-2">Crownfit Logistics — Book & Track</h1>
        <p className="mb-6">Request pickup, delivery or end-to-end logistics within Texas. Track shipments by Air Way Bill or Bill of Lading.</p>
        <div className="flex gap-4">
           <div className="flex flex-col gap-4">
  <Link>📦 Create Booking</Link>     {/* Line 1 */}
  <Link>🔍 Track Shipment</Link>     {/* Line 2 - below */}
</div>

          </Link>
        </div>
      </main>
    </div>
  );
}
