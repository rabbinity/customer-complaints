import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../config";
import AddInventoryModal from "../../modals/AddInventoryModal";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/A/listproducts`);
      const fetchedProducts = response.data.products || [];
      setProducts(fetchedProducts);
      // Apply search filter immediately after fetch
      setFilteredProducts(
        fetchedProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category &&
              product.category.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update filteredProducts when searchTerm or products changes
  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.category &&
            product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Delete product handler
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}/api/A/inventory/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center text-gray-300">Loading products...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <img
                      src={product.image}
                      alt="Product img"
                      className="h-10 w-10 rounded-full"
                    />
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    zmk{product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {product.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-300">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Inventory Modal */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onInventoryAdded={() => fetchProducts()}
      />
    </motion.div>
  );
};

export default ProductsTable;


















