import React, { useState, useEffect } from 'react';

function Bases() {
  const [bases, setBases] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', capacity: '' });
  const [showForm, setShowForm] = useState(false);

  // Fetch all bases on load
  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    const res = await fetch('http://localhost:5000/api/bases');
    const data = await res.json();
    if (data.success) setBases(data.bases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/bases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setBases([...bases, data.base]); // add new base to list
      setForm({ name: '', location: '', capacity: '' }); // reset form
      setShowForm(false); // hide form after submit
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bases</h1>
      <p className="mb-6">Manage and view all military bases here.</p>

      {/* Toggle Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Base
        </button>
      )}

      {/* Form appears only when button clicked */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 mt-4 border p-4 rounded bg-slate-700">
          <input
            type="text"
            placeholder="Base Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <div className="flex space-x-3">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Save Base
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Display bases */}
      <ul className="space-y-3 mt-6">
        {bases.map((base) => (
          <li key={base._id} className="p-4 border rounded-lg bg-slate-800 text-white">
            <h2 className="text-lg font-semibold">{base.name}</h2>
            <p>📍 {base.location}</p>
            <p>Capacity: {base.capacity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bases;
