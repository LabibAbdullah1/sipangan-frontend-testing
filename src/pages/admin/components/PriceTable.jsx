import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, TrendingUp, Filter, Calendar, MapPin, Package } from 'lucide-react';
import AdminModal from './AdminModal';
import CustomAlert from '../../../components/CustomAlert';
import CustomDropdown from '../../../components/CustomDropdown';
import { priceService, mapService } from '../../../api/services';

const JAWA_TIMUR_REGIONS = [
  "Kabupaten Bangkalan", "Kabupaten Banyuwangi", "Kabupaten Blitar", "Kabupaten Bojonegoro", 
  "Kabupaten Bondowoso", "Kabupaten Gresik", "Kabupaten Jember", "Kabupaten Jombang", 
  "Kabupaten Kediri", "Kabupaten Lamongan", "Kabupaten Lumajang", "Kabupaten Madiun", 
  "Kabupaten Magetan", "Kabupaten Malang", "Kabupaten Mojokerto", "Kabupaten Nganjuk", 
  "Kabupaten Ngawi", "Kabupaten Pacitan", "Kabupaten Pamekasan", "Kabupaten Pasuruan",
  "Kabupaten Ponorogo", "Kabupaten Probolinggo", "Kabupaten Sampang", "Kabupaten Sidoarjo", 
  "Kabupaten Situbondo", "Kabupaten Sumenep", "Kabupaten Trenggalek", "Kabupaten Tuban", 
  "Kabupaten Tulungagung", "Kota Batu", "Kota Blitar", "Kota Kediri", "Kota Madiun", 
  "Kota Malang", "Kota Mojokerto", "Kota Pasuruan", "Kota Probolinggo", "Kota Surabaya"
];

const PriceTable = ({ commodities }) => {
  const [prices, setPrices] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState({
    commodity: '',
    region: ''
  });

  const [formData, setFormData] = useState({
    commodity_id: '',
    region_id: '',
    price: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    fetchPrices();
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  const fetchRegions = async () => {
    try {
      const response = await mapService.getMapData();
      setRegions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    }
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await priceService.getHistory(filters);
      setPrices(response.data || []);
    } catch (error) {
      console.error('Failed to load prices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrices = prices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(prices.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenModal = (price = null) => {
    if (price) {
      setCurrentPrice(price);
      setFormData({
        commodity_id: price.commodity_id,
        region_id: price.region_id,
        price: price.price,
        date: price.date.split('T')[0]
      });
    } else {
      setCurrentPrice(null);
      setFormData({
        commodity_id: commodities[0]?.id || '',
        region_id: regions[0]?.id || '',
        price: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentPrice) {
        await priceService.update(currentPrice.id, formData);
        showAlert({
          title: 'Record Updated',
          message: 'Price data has been successfully updated.',
          type: 'success'
        });
      } else {
        await priceService.create(formData);
        showAlert({
          title: 'Success!',
          message: 'New price record has been added.',
          type: 'success'
        });
      }
      fetchPrices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save price record:', error);
      const serverMessage = error.response?.data?.message || 'Could not save price record. Please check your input and connection.';
      showAlert({
        title: 'Error Saving Data',
        message: serverMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    showAlert({
      title: 'Delete Price Record?',
      message: 'This action cannot be undone. Are you sure?',
      type: 'error',
      isConfirm: true,
      confirmText: 'Delete Record',
      onConfirm: async () => {
        try {
          await priceService.delete(id);
          fetchPrices();
          closeAlert();
          showAlert({
            title: 'Deleted',
            message: 'Price record has been removed.',
            type: 'success'
          });
        } catch (error) {
          console.error('Delete failed:', error);
          const serverMessage = error.response?.data?.message || 'Failed to delete record. Please try again.';
          showAlert({
            title: 'Delete Failed',
            message: serverMessage,
            type: 'error',
            isConfirm: false
          });
        }
      }
    });
  };

  const commodityOptions = [
    { label: 'All Commodities', value: '' },
    ...commodities.map(c => ({ label: c.name, value: c.name }))
  ];

  const regionOptions = [
    { label: 'All Regions', value: '' },
    ...JAWA_TIMUR_REGIONS.map(r => ({ label: r, value: r }))
  ];

  const modalCommodityOptions = commodities.map(c => ({ label: c.name, value: c.id }));
  const modalRegionOptions = regions.map(r => ({ label: r.name, value: r.id }));

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 shrink-0">
          <TrendingUp className="text-blue-500" size={20} />
          Price Records
        </h2>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full xl:w-auto">
          {/* Custom Filter UI */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl w-full md:w-auto">
            <div className="w-full sm:w-56">
              <CustomDropdown
                value={filters.commodity}
                onChange={(val) => setFilters({ ...filters, commodity: val })}
                options={commodityOptions}
                placeholder="Commodity"
                icon={Package}
              />
            </div>
            <div className="w-full sm:w-64">
              <CustomDropdown
                value={filters.region}
                onChange={(val) => setFilters({ ...filters, region: val })}
                options={regionOptions}
                placeholder="Region"
                icon={MapPin}
              />
            </div>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 shrink-0"
          >
            <Plus size={18} /> <span className="sm:inline">New Entry</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[180px]">Date</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Region</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right w-[150px]">Price</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <span className="text-gray-500 text-sm font-medium">Fetching Price History...</span>
                    </div>
                  </td>
                </tr>
              ) : currentPrices.length > 0 ? (
                currentPrices.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <Calendar size={14} className="text-gray-600" />
                        {new Date(item.date).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">{item.region}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-emerald-500 font-black text-sm">
                        Rp {(parseInt(item.price) || 0).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                    No price records found. Try adjusting filters or add a new entry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {!loading && prices.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-white/5 bg-gray-900/30 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Showing <span className="text-white">{indexOfFirstItem + 1}</span> to <span className="text-white">{Math.min(indexOfLastItem, prices.length)}</span> of <span className="text-white">{prices.length}</span> records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show only current, first, last, and neighbors if many pages
                  if (
                    totalPages > 7 &&
                    page !== 1 &&
                    page !== totalPages &&
                    Math.abs(page - currentPage) > 1
                  ) {
                    if (Math.abs(page - currentPage) === 2) return <span key={page} className="text-gray-700">...</span>;
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`
                        w-8 h-8 rounded-lg text-xs font-black transition-all
                        ${currentPage === page 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                          : 'text-gray-500 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Entry Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPrice ? 'Edit Price Entry' : 'New Price Entry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Commodity</label>
              <CustomDropdown
                value={formData.commodity_id}
                onChange={(val) => setFormData({ ...formData, commodity_id: val })}
                options={modalCommodityOptions}
                placeholder="Select Commodity"
                icon={Package}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Region</label>
              <CustomDropdown
                value={formData.region_id}
                onChange={(val) => setFormData({ ...formData, region_id: val })}
                options={modalRegionOptions}
                placeholder="Select Region"
                icon={MapPin}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Price (IDR)</label>
              <input
                type="number"
                required
                placeholder="e.g. 12500"
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 font-medium"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Record Date</label>
              <input
                type="date"
                required
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Record...
                </>
              ) : (
                currentPrice ? 'Update Record' : 'Create Record'
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

export default PriceTable;
