# API Documentation
-----------------------------------------------------
#### 1. User Routes ####
------

## User Register:

## Endpoint

- **POST http://localhost:8000/api/user/create**

**Payload:**

```json
{
  "username": "rabbi",
  "email": "rabbikindalo001@gmail.com",
  "password": "password123",
  "phoneNumber": "555-1234",
  "role": ""
}
```
or with rol
```
{
 "username":"jamadrac",
  "email": "vectormagnitude001@gmail.com",
  "password": "qwertyuiop",
  "phoneNumber": "0760076123",
    "role": "ADMIN"
  
}
```
### Response:

- A user

-------------------------------------------

## User Login:

## Endpoint

- **POST http://localhost:8000/api/user/login**

**Payload:**

```json
{
  "email": "rabbikindalo001@gmail.com",
  "password": "password123"
}
```

### Response:

- A user

------------------------------------------------------

## Forgot Password:

### Endpoint:

- **POST http://localhost:8000/api/user/forgot-password**

### Request:

- Body must contain all the filters:
  - email

```json
{
  "email": "rabbikindalo001@gmail.com"
}
```

### Response:

- A user password reset link

-----------------------------------------------------------

## Reset Password:

**API Endpoint:**

- **PUT http://localhost:8000/api/user/reset-password/:id/:token**

### Request:

-Body must contain all the filters:
-password

### Parameters:
-user-id
-token from reset link

```json
{
  "password": "87654321"
}
```

## Response:
-An updated user with a new password

-----------------------------------------------------------------
-----------------------------------------------------------------


#### 2. Bus Routes ####
-----

## Find Buses by Destination and Departure:

### Endpoint:
- **GET http://localhost:8000/api/bus/find/:destination/:departure**

### Parameters:
- destination
- departure

- URL**http://localhost:4000/api/bus/find/Copperbelt/Luapula**

### Validation Middleware:
- `findBusesValidation`

### Response:
- An array of buses using the specified routes


-------------------------------------------------------------------

## Get All Buses

### Endpoint:
- **GET http://localhost:8000/api/bus/all**

### Response:
- An array of buses


--------------------------------------------------------------------
--------------------------------------------------------------------

#### 3. BusRoute i.e source/destination Routes ####
-----

## Create Bus Route:

### Endpoint:
- **POST  http://localhost:8000/api/bus-route/create**

### Request:
- Body must contain all the filters:
  - destination
  - departure
  - duration
  - price
  - dates[]

```json
{
  "destination": "Copperbelt",
  "departure": "Luapula",
  "duration": 6,
  "price": 250,
  "dates": [
    "2023-01-01T08:00:00.000Z",
    "2023-01-01T08:00:00.000Z"
  ]
}
```

### Validation Middleware:
- `createBusRouteValidation`

### Response:
- A bus route created with specified fields

-----------------------------------------------------

## Add Bus To Routes:

### Endpoint:
- **POST http://localhost:8000/api/bus-route/add**

### Request:
- Body must contain all the filters:
  - destination
  - departure
  - buses[]

```json
{
  "departure": "Luapula",
  "destination": "Copperbelt",
  "buses": [
    {
      "name": "Power Tools",
      "operatorName": "Rabbi",
      "rating": 4.5,
      "contact": "097415778",
      "seatNumber": 30,
      "departureTime": "2023-01-01T08:00:00.000Z",
      "arrivalTime": "2023-01-01T18:00:00.000Z"
    }
  ]
}
```

### Validation Middleware:
- `addBusToRoutesValidation`

### Response:
- An array of buses with given 


------------------------------------------------------

## Get All Bus routes

### Endpoint:
- **GET http://localhost:8000/api/bus-route/all**

### Response:
- An array of bus routes


------------------------------------------------------
------------------------------------------------------
