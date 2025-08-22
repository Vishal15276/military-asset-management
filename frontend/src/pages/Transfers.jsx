import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, ArrowRight, X } from 'lucide-react';

function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    equipmentType: '',
    quantity: '',
    fromBase: '',
    toBase: '',
    notes: '',
    expectedArrival: ''
  });

  // Fetch transfers
  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transfers');
      const data = await res.json();
      if (data.success) setTransfers(data.transfers);
    } catch (err) {
      console.error("Error fetching transfers:", err);
    }
  };

  const handleAddTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransfer)
      });
      const data = await res.json();
      if (data.success) {
        setTransfers([data.transfer, ...transfers]);
        setShowAddModal(false);
        setNewTransfer({
          equipmentType: '',
          quantity: '',
          fromBase: '',
          toBase: '',
          notes: '',
          expectedArrival: ''
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error adding transfer:", err);
    }
  };

  const filteredTransfers = transfers.filter(transfer =>
    transfer.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.fromBase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.toBase.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Transfer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search transfers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Transfers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6">Equipment</th>
                <th className="text-left py-3 px-6">Route</th>
                <th className="text-left py-3 px-6">Quantity</th>
                <th className="text-left py-3 px-6">Expected Arrival</th>
                <th className="text-left py-3 px-6">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransfers.map((transfer) => (
                <tr key={transfer._id} className="hover:bg-gray-50">
                  {/* Equipment */}
                  <td className="py-4 px-6 flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{transfer.equipmentType}</span>
                  </td>
                  {/* Route */}
                  <td className="py-4 px-6 text-sm text-gray-700">
                    {transfer.fromBase}{' '}
                    <ArrowRight className="inline w-4 h-4 text-gray-400 mx-1" />{' '}
                    {transfer.toBase}
                  </td>
                  {/* Quantity */}
                  <td className="py-4 px-6">{transfer.quantity}</td>
                  {/* Expected Arrival */}
                  <td className="py-4 px-6">{transfer.expectedArrival?.slice(0, 10)}</td>
                  {/* Notes */}
                  <td className="py-4 px-6 text-gray-500">{transfer.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transfer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">New Transfer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransfer} className="space-y-4">
              <input
                type="text"
                placeholder="Equipment Type"
                value={newTransfer.equipmentType}
                onChange={(e) => setNewTransfer({ ...newTransfer, equipmentType: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newTransfer.quantity}
                onChange={(e) => setNewTransfer({ ...newTransfer, quantity: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="From Base"
                value={newTransfer.fromBase}
                onChange={(e) => setNewTransfer({ ...newTransfer, fromBase: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="To Base"
                value={newTransfer.toBase}
                onChange={(e) => setNewTransfer({ ...newTransfer, toBase: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="date"
                value={newTransfer.expectedArrival}
                onChange={(e) => setNewTransfer({ ...newTransfer, expectedArrival: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                placeholder="Notes"
                value={newTransfer.notes}
                onChange={(e) => setNewTransfer({ ...newTransfer, notes: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transfers;
