# Inventory System API - Postman Testing Documentation

## Overview

This documentation explains how to test the Inventory System API endpoints using Postman. The API endpoints include creating warehouses and stores, adding inventory, transferring stock, recording sales, and handling orders (request, approval, and receipt). Email notifications are sent when certain thresholds are met and when orders are processed. No token-based authentication is used.

## Base URL

Assuming your server is running on:  
http://localhost:3000

markdown
Copy
Edit
*(Adjust as needed.)*

## Endpoints

### 1. Create Warehouse

- **Endpoint:** `POST /warehouse`
- **Description:** Creates a new warehouse.
- **Request Body:**
  ```json
  {
    "name": "Central Warehouse",
    "location": "123 Main St, City"
  }
Expected Response:
json
Copy
Edit
{
  "warehouse": {
    "id": 1,
    "name": "Central Warehouse",
    "location": "123 Main St, City",
    "createdAt": "2025-03-12T00:00:00.000Z"
  },
  "message": "Warehouse created successfully"
}
### 2. Create Store
Endpoint: POST /store
Description: Creates a new store.
Request Body:
json
Copy
Edit
{
  "name": "Downtown Store",
  "location": "456 Market St, City"
}
Expected Response:
json
Copy
Edit
{
  "store": {
    "id": 1,
    "name": "Downtown Store",
    "location": "456 Market St, City",
    "createdAt": "2025-03-12T00:00:00.000Z"
  },
  "message": "Store created successfully"
}
#### 3. Add Inventory in Warehouse (Add Product)
Endpoint: POST /inventory
Description: Adds a new product to the warehouse inventory.
Request Body:
json
Copy
Edit
{
  "warehouseId": 1,
  "name": "Product A",
  "stock": 150,
  "price": 10.5,
  "afterSalePrice": 15.0
}
Expected Response:
json
Copy
Edit
{
  "product": {
    "id": 1,
    "name": "Product A",
    "stock": 150,
    "price": 10.5,
    "afterSalePrice": 15.0,
    "...": "other product details"
  },
  "message": "Product added to warehouse inventory"
}
Email Notification: An email is sent if the stock is below 100 units.
####  4. Transfer Stock from Warehouse to Store
Endpoint: POST /transfer
Description: Transfers stock from a warehouse to a store.
Request Body:
json
Copy
Edit
{
  "warehouseId": 1,
  "storeId": 1,
  "productId": 1,
  "quantity": 20
}
Expected Response:
json
Copy
Edit
{
  "message": "Stock transferred successfully"
}
Email Notifications:
An email is sent if the store inventory falls below 10 units.
An email is sent if the warehouse stock goes below 100 units.
#### 5. Record Sale
Endpoint: POST /sale
Description: Records a sale at a store.
Request Body:
json
Copy
Edit
{
  "storeId": 1,
  "productId": 1,
  "quantitySold": 5
}
Expected Response:
json
Copy
Edit
{
  "sale": {
    "id": 1,
    "storeId": 1,
    "productId": 1,
    "quantitySold": 5,
    "totalAmount": 75,
    "profit": 25,
    "saleDate": "2025-03-12T00:00:00.000Z"
  },
  "message": "Sale recorded successfully"
}
Email Notification: An email is sent if the store’s remaining stock falls below 10 units.
####  6. Request Order
Endpoint: POST /order/request
Description: Requests an order from the warehouse.
Request Body:
json
Copy
Edit
{
  "storeId": 1,
  "productId": 1,
  "quantity": 30,
  "requestedBy": "John Doe"
}
Expected Response:
json
Copy
Edit
{
  "order": {
    "id": 1,
    "storeId": 1,
    "productId": 1,
    "quantity": 30,
    "status": "PENDING",
    "requestedAt": "2025-03-12T00:00:00.000Z",
    "requestedBy": "John Doe"
  },
  "message": "Order requested successfully"
}
Email Notification: An email is sent with order details (including the user name and store name) and status "PENDING".
#### 7. Approve Order (by Admin)
Endpoint: POST /order/approve
Description: Approves a pending order.
Request Body:
json
Copy
Edit
{
  "orderId": 1,
  "adminName": "Admin User"
}
Expected Response:
json
Copy
Edit
{
  "order": {
    "id": 1,
    "storeId": 1,
    "productId": 1,
    "quantity": 30,
    "status": "APPROVED",
    "approvedAt": "2025-03-12T00:00:00.000Z",
    "...": "other order details"
  },
  "message": "Order approved successfully"
}
Email Notification: An email is sent with order details and status "APPROVED", including the admin name.
####  8. Record Received Order and Update Inventory
Endpoint: POST /order/receive
Description: Records that an order has been received and updates the store inventory.
Request Body:
json
Copy
Edit
{
  "orderId": 1
}
Expected Response:
json
Copy
Edit
{
  "order": {
    "id": 1,
    "storeId": 1,
    "productId": 1,
    "quantity": 30,
    "status": "RECEIVED",
    "receivedAt": "2025-03-12T00:00:00.000Z",
    "...": "other order details"
  },
  "message": "Order received and inventory updated successfully"
}
Email Notification: An email is sent with order details and status "RECEIVED".