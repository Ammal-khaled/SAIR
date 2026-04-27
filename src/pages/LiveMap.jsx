import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Layers,
  Navigation,
  X,
  Clock,
  Car,
  User
} from 'lucide-react';

import api from "../api/client";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// ---------------- Styles ----------------
const globalStyles = `
  @keyframes pulse-red {
    0% { transform: scale(1); opacity: 1; }
    70% { transform: scale(2.5); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }

  .animate-pulse-red {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ef4444;
    animation: pulse-red 2s infinite;
  }
`;

// ---------------- clustering (LAT/LNG based) ----------------
const clusterIncidents = (incidents, precision = 1) => {
  const clusters = {};

  incidents.forEach((inc) => {
    const key = `${inc.lat?.toFixed(precision)}-${inc.lng?.toFixed(precision)}`;

    if (!clusters[key]) {
      clusters[key] = {
        ...inc,
        cluster: [inc]
      };
    } else {
      clusters[key].cluster.push(inc);
    }
  });

  return Object.values(clusters);
};

export default function LiveMap() {
  const [incidents, setIncidents] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('map');

  // ---------------- API + REALTIME ----------------
  useEffect(() => {
    let interval;

    const fetchReports = async () => {
      try {
        const res = await api.get("/reports/my");

        const mapped = res.data
          .filter(r => r.lat && r.lng) // مهم جداً
          .map((r) => ({
            id: r.id,
            type: r.accidentType,
            time: new Date(r.createdAt).toLocaleString(),
            status: r.status,
            urgent: r.status === "submitted",
            plate: r.platesNumber?.[0] || "",
            statement: r.description,

            // 🔥 REAL LOCATION
            lat: r.lat,
            lng: r.lng,
          }));

        setIncidents(mapped);

      } catch (err) {
        console.log(err?.response?.data || err);
      }
    };

    fetchReports();
    interval = setInterval(fetchReports, 10000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- FILTER ----------------
  const filteredIncidents = incidents.filter((inc) =>
    String(inc.id ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(inc.plate ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clusters = clusterIncidents(filteredIncidents);

  // ---------------- MAP POSITION NORMALIZATION ----------------
  // نحول lat/lng لنسبة على الشاشة
  const normalize = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  const latValues = clusters.map(i => i.lat);
  const lngValues = clusters.map(i => i.lng);

  const minLat = Math.min(...latValues);
  const maxLat = Math.max(...latValues);
  const minLng = Math.min(...lngValues);
  const maxLng = Math.max(...lngValues);

  return (
    <div className="flex h-screen bg-[#f1f5f9]">
      <style>{globalStyles}</style>

      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 flex flex-col">

        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <main className="flex-1 relative overflow-hidden bg-gray-200">

          {/* TOP PANEL */}
          <div className="absolute top-6 left-6 z-20 bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold">Live Incidents</h2>
            <p className="text-sm text-gray-500">
              Total: {filteredIncidents.length} • Urgent: {filteredIncidents.filter(i => i.urgent).length}
            </p>
          </div>

          {/* MAP AREA (REAL COORDINATES) */}
          <div className="relative w-full h-full">

            {clusters.map((c) => {
              const x = normalize(c.lng, minLng, maxLng);
              const y = normalize(c.lat, minLat, maxLat);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedPin(c)}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${x}%`,
                    top: `${100 - y}%` // invert map Y axis
                  }}
                >
                  <div className="relative">
                    <div className={`w-5 h-5 rounded-full ${
                      c.urgent ? "bg-red-500" : "bg-blue-500"
                    } border-2 border-white shadow-lg`} />

                    {c.cluster.length > 1 && (
                      <div className="absolute -top-2 -right-2 bg-black text-white text-[10px] px-1 rounded-full">
                        {c.cluster.length}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* POPUP */}
          {selectedPin && (
            <div className="absolute right-6 top-24 bg-white shadow-2xl rounded-2xl p-5 w-80 z-30">

              <div className="flex justify-between">
                <h3 className="font-bold">{selectedPin.id}</h3>
                <button onClick={() => setSelectedPin(null)}>
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {selectedPin.type}
              </p>

              <div className="mt-3 space-y-2 text-sm">
                <p><Clock size={14} className="inline mr-1" /> {selectedPin.time}</p>
                <p><Car size={14} className="inline mr-1" /> {selectedPin.plate}</p>
                <p><User size={14} className="inline mr-1" /> {selectedPin.statement}</p>
              </div>

              <div className="mt-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedPin.urgent ? "bg-red-100 text-red-600" : "bg-gray-100"
                }`}>
                  {selectedPin.urgent ? "Urgent" : "Normal"}
                </span>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}