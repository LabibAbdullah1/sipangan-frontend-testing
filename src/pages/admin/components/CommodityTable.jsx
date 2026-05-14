import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Package } from 'lucide-react';
import AdminModal from './AdminModal';
import CustomAlert from '../../../components/CustomAlert';
import { commodityService } from '../../../api/services';

const CommodityTable = ({ commodities, loading, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCommodity, setCurrentCommodity] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: 'kg' });
  const [submitting, setSubmitting] = useState(false);

  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    isConfirm: false,
    onConfirm: null
  });

  const showAlert = (config) => {
    setAlertConfig({ ...config, isOpen: true });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false });
  };

  const handleOpenModal = (commodity = null) => {
    if (commodity) {
      setCurrentCommodity(commodity);
      setFormData({ name: commodity.name, unit: commodity.unit || 'kg' });
    } else {
      setCurrentCommodity(null);
      setFormData({ name: '', unit: 'kg' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentCommodity) {
        await commodityService.update(currentCommodity.id, formData);
        showAlert({
          title: 'Updated!',
          message: 'Commodity has been updated successfully.',
          type: 'success'
        });
      } else {
        await commodityService.create(formData);
        showAlert({
          title: 'Success!',
          message: 'New commodity has been added to the catalog.',
          type: 'success'
        });
      }
      onRefresh();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save commodity:', error);
      showAlert({
        title: 'Error!',
        message: 'Failed to save commodity. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    showAlert({
      title: 'Delete Commodity?',
      message: 'Are you sure you want to delete this commodity? All associated price data might be affected.',
      type: 'error',
      isConfirm: true,
      confirmText: 'Delete Now',
      onConfirm: async () => {
        try {
          await commodityService.delete(id);
          onRefresh();
          closeAlert();
          showAlert({
            title: 'Deleted!',
            message: 'Commodity has been removed.',
            type: 'success'
          });
        } catch (error) {
          console.error('Delete failed:', error);
          const serverMessage = error.response?.data?.message || 'Could not delete commodity. It might be in use.';
          showAlert({
            title: 'Action Failed',
            message: serverMessage,
            type: 'error',
            isConfirm: false
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Package className="text-emerald-500" size={20} />
          Commodity Catalog
        </h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 w-full sm:w-auto"
        >
          <Plus size={18} /> Add Commodity
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
          <thead className="bg-gray-900/50 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Unit</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <span className="text-gray-500 text-sm font-medium">Synchronizing Catalog...</span>
                  </div>
                </td>
              </tr>
            ) : commodities.length > 0 ? (
              commodities.map((item) => (
                <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">#{item.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-white font-bold tracking-tight">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium lowercase">{item.unit || 'kg'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No commodities found. Start by adding a new one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCommodity ? 'Edit Commodity' : 'New Commodity'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Commodity Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Beras Premium"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Measurement Unit</label>
            <input
              type="text"
              required
              placeholder="e.g. kg, liter, ikat"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
            <p className="text-[10px] text-gray-500 italic mt-1">* Backend requires unit (e.g. "kg")</p>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                currentCommodity ? 'Update Commodity' : 'Create Commodity'
              )}
            </button>
          </div>
        </form>
      </AdminModal>

      <CustomAlert
        {...alertConfig}
        onClose={closeAlert}
      />
    </div>
  );
};

export default CommodityTable;
