// router.ts

import express from "express";
import {
  createWarehouseController,
  createStoreController,
  addInventoryController,
  transferStockController,
  recordSaleController,
  requestOrderController,
  approveOrderController,
  recordReceivedOrderController,
  updateWarehouseController,
  deleteStoreController,
  deleteWarehouseController,
  listStoresController,
  listWarehousesController,
  updateStoreController,
  listInventoryController,
  deleteInventoryController,
  getOrdersController,
  updateOrderStatusController,
} from "./application_handler";

const router = express.Router();

// Create Warehouse
router.post("/warehouse", createWarehouseController);
// Create Store
router.post("/store", createStoreController);
// Add Inventory in Warehouse (Add Product)
router.post("/inventory", addInventoryController);
router.delete("/inventory/:id", deleteInventoryController);
router.get("/listproducts", listInventoryController);
// Transfer Stock from Warehouse to Store
router.post("/transfer", transferStockController);
// Record Sale
router.post("/sale", recordSaleController);
// Request Order
router.post("/order/request", requestOrderController);
router.get("/listorders", getOrdersController );
router.put("/updateStutusOrder", updateOrderStatusController );
// Approve Order (by Admin)
router.post("/order/approve", approveOrderController);
// Record Received Order and Update Inventory
router.post("/order/receive", recordReceivedOrderController);
router.get("/warehouse", listWarehousesController);
router.get("/api/A/inventory", listInventoryController);
router.put("/warehouse/:id", updateWarehouseController);
router.delete("/warehouse/:id", deleteWarehouseController);

// Store routes

router.get("/store", listStoresController);
router.put("/store/:id", updateStoreController);
router.delete("/store/:id", deleteStoreController);

export default router;
