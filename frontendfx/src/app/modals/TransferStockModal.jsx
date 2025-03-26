/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config";

const TransferStockModal = ({ isOpen, onClose, onTransferCompleted }) => {
  const [warehouseId, setWarehouseId] = useState("");
  const [storeId, setStoreId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Processing transfer request...");

    try {
      // Convert all ID fields to integers before sending
      const response = await axios.post(`${API_URL}/api/A/transfer`, {
        warehouseId: parseInt(warehouseId, 10),
        storeId: parseInt(storeId, 10),
        productId: parseInt(productId, 10),
        quantity: parseInt(quantity, 10),
      });

      setLoadingMessage(response.data.message || "Transfer successful");
      
      // Notify parent component of successful transfer
      onTransferCompleted && onTransferCompleted(response.data);

      // Reset form fields after successful submission
      setTimeout(() => {
        setWarehouseId("");
        setStoreId("");
        setProductId("");
        setQuantity("");
        setLoading(false);
        onClose(); // Close modal on success after showing message briefly
      }, 1500);
      
    } catch (err) {
      console.error("Transfer error:", err);
      
      // Extract the error message in a way that avoids rendering objects
      let errorMessage = "Server error";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        // If data is a string, use it directly
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } 
        // If it's an object with error details
        else if (err.response.data.error) {
          errorMessage = typeof err.response.data.error === 'string' 
            ? err.response.data.error 
            : "Database validation error";
        }
      }
      
      setLoadingMessage(`Error: ${errorMessage}`);
                        
      // Keep error message visible briefly then reset
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 text-gray-100 rounded-lg shadow-lg w-full max-w-md p-6 border border-gray-700"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Transfer Stock</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200"
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Warehouse ID</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100"
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    required
                    disabled={loading}
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Store ID</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    required
                    disabled={loading}
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">Product ID</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                    disabled={loading}
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Loading Area with Message */}
              <div className="mb-4 text-center">
                {loading && (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mb-2"></div>
                    <div className={`p-2 text-sm rounded-md ${
                      loadingMessage.toLowerCase().includes("error") || loadingMessage.toLowerCase().includes("failed")
                        ? "text-red-100"
                        : "text-green-100"
                    }`}>
                      {loadingMessage}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransferStockModal;