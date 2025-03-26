import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config";

const RequestOrderModal = ({ isOpen, onClose, onOrderRequested }) => {
  const [storeId, setStoreId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendResponse, setBackendResponse] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBackendResponse("");
    try {
      const response = await axios.post(`${API_URL}/api/A/order/request`, {
        storeId: Number(storeId),
        productId: Number(productId),
        quantity: Number(quantity),
        requestedBy,
      });
      
      // Extract the message from the response
      setBackendResponse(response.data.message || "Order requested successfully");
      
      // Pass the complete response data to the parent component
      onOrderRequested && onOrderRequested(response.data.order);
      
      // Clear the form fields after successful submission
      setTimeout(() => {
        setStoreId("");
        setProductId("");
        setQuantity("");
        setRequestedBy("");
      }, 2000);
    } catch (err) {
      // Handle the error structure from the API
      const errorMessage = 
        err.response?.data?.message || 
        "Failed to request order";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 text-gray-100"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-white">Request Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1">Store ID</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Product ID</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Requested By</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4 min-h-12">
                {loading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
                  </div>
                )}
                {backendResponse && (
                  <div className="p-2 bg-green-800 text-green-100 rounded">
                    {backendResponse}
                  </div>
                )}
                {error && (
                  <div className="p-2 bg-red-800 text-red-100 rounded">
                    {error}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={onClose} 
                  disabled={loading} 
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
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

export default RequestOrderModal;