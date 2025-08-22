import React, { useEffect, useState } from "react";
import { Package, PlusCircle, X } from "lucide-react";
import axios from "axios";

function Equipment() {
  const [filter, setFilter] = useState("all");
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    category: "Other",
    quantity: 1,
    base: "",
  });

  // ✅ Fetch equipment from backend
  const fetchEquipment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/equipment");
      setEquipmentList(res.data);
    } catch (error) {
      console.error("❌ Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // ✅ Add equipment handler
  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/equipment", newEquipment);
      setEquipmentList((prev) => [...prev, res.data]); // update state
      setShowModal(false);
      setNewEquipment({ name: "", category: "Other", quantity: 1, base: "" }); // reset
    } catch (error) {
      console.error("❌ Error adding equipment:", error);
      alert("Failed to add equipment");
    }
  };

  const filteredEquipment =
    filter === "all"
      ? equipmentList
      : equipmentList.filter((eq) => eq.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600 mt-1">Manage and view all equipment</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Equipment
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="Weapons">Weapons</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Communications">Communications</option>
          <option value="Medical">Medical</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 italic">
                  Loading equipment...
                </td>
              </tr>
            ) : filteredEquipment.length > 0 ? (
              filteredEquipment.map((eq) => (
                <tr key={eq._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{eq._id.slice(-6)}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>{eq.name}</span>
                  </td>
                  <td className="px-6 py-4">{eq.category}</td>
                  <td className="px-6 py-4 font-semibold">{eq.quantity}</td>
                  <td className="px-6 py-4">{eq.base}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 italic">
                  No equipment found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Equipment Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Equipment</h2>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select
                  value={newEquipment.category}
                  onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Weapons">Weapons</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Communications">Communications</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({ ...newEquipment, quantity: e.target.value })}
                  min="1"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Base</label>
                <input
                  type="text"
                  value={newEquipment.base}
                  onChange={(e) => setNewEquipment({ ...newEquipment, base: e.target.value })}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Save Equipment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Equipment;
