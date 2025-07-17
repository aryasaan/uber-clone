# User & Captain Registration & Login API Documentation

## Endpoints

### User Endpoints
- **POST** `/users/register` — Register a new user
- **POST** `/users/login` — Login with email and password
- **GET** `/users/profile` — Get logged-in user's profile (requires authentication)
- **GET** `/users/logout` — Logout user and blacklist current token

### Captain Endpoints
- **POST** `/captains/register` — Register a new captain
- **POST** `/captains/login` — Login with email and password
- **GET** `/captains/profile` — Get logged-in captain's profile (requires authentication)
- **GET** `/captains/logout` — Logout captain and blacklist current token

---

## /users/register

### Description

Register a new user by providing their full name, email, and password.  
The backend validates all fields and returns a JWT token on successful registration.

### Request Body

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

### Field Requirements

| Field              | Type   | Required | Validation                    |
| ------------------ | ------ | -------- | ----------------------------- |
| fullname.firstname | String | Yes      | Minimum 3 characters          |
| fullname.lastname  | String | Yes      | Minimum 3 characters          |
| email              | String | Yes      | Must be a valid email address |
| password           | String | Yes      | Minimum 6 characters          |

### Responses

#### Success

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "token": "<JWT_TOKEN>",
    "newUser": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other fields
    }
  }
  ```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field",
        "location": "body"
      }
    ]
  }
  ```

#### Server Error

- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "error": "Error message"
  }
  ```

---

## /users/login

### Description

Login an existing user using email and password.  
Returns a JWT token and user details on successful authentication.

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

### Field Requirements

| Field    | Type   | Required | Validation                    |
| -------- | ------ | -------- | ----------------------------- |
| email    | String | Yes      | Must be a valid email address |
| password | String | Yes      | Minimum 6 characters          |

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "<JWT_TOKEN>",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other fields
    }
  }
  ```

#### Invalid Credentials

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field",
        "location": "body"
      }
    ]
  }
  ```

#### Server Error

- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "error": "Error message"
  }
  ```

---

## /users/profile

### Description

Get the profile of the currently authenticated user.  
Requires a valid JWT token (sent as a cookie or in the `Authorization` header).

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other fields
    }
  }
  ```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Unauthorized access, please login first"
  }
  ```

---

## /users/logout

### Description

Logs out the current user by blacklisting their JWT token.  
After logout, the token cannot be used for authentication anymore.

### Route

**GET** `/users/logout`  
_(Requires authentication; send token as cookie or Authorization header)_

### How it works

- The current JWT token is added to the `blacklistToken` collection in the database.
- The token is set to expire automatically after **1 day** (24 hours) using MongoDB's TTL index.
- The `token` cookie is cleared from the client.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "User logged out successfully"
  }
  ```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Unauthorized access, please login first"
  }
  ```

---

## Token Blacklist & TTL

- **blacklistToken** is a MongoDB collection that stores blacklisted JWT tokens.
- Each token document has a `createdAt` field with a TTL (Time To Live) of **1 day**.
- After 1 day, MongoDB automatically deletes the blacklisted token from the collection.
- This ensures that logged-out tokens cannot be reused, but the blacklist does not grow indefinitely.

**Example blacklistToken document:**

```json
{
  "token": "<JWT_TOKEN>",
  "createdAt": "2024-07-11T12:00:00.000Z"
}
```

---

## Example Logout Request (using curl)

```sh
curl -X GET http://localhost:3000/users/logout \
  --cookie "token=<JWT_TOKEN>"
```

---

## Captain Registration

## /captains/register

### Description

Register a new captain by providing their full name, email, password, and vehicle details.  
The backend validates all fields and returns a JWT token on successful registration.

### Request Body

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword",
  "vehicle": {
    "color": "White",
    "plate": "ABC123",
    "capacity": 4,
    "type": "car"
  }
}
```

### Field Requirements

| Field              | Type   | Required | Validation                    |
| ------------------ | ------ | -------- | ----------------------------- |
| fullname.firstname | String | Yes      | Minimum 3 characters          |
| fullname.lastname  | String | Yes      | Minimum 3 characters          |
| email              | String | Yes      | Must be a valid email address |
| password           | String | Yes      | Minimum 6 characters          |
| vehicle.color      | String | Yes      | Minimum 3 characters          |
| vehicle.plate      | String | Yes      | Minimum 3 characters          |
| vehicle.capacity   | Number | Yes      | Between 1 and 6               |
| vehicle.type       | String | Yes      | Must be 'car', 'bike', or 'auto' |

### Responses

#### Success

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "newCaptain": {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "status": "inactive",
      "vehicle": {
        "color": "White",
        "plate": "ABC123",
        "capacity": 4,
        "type": "car"
      },
      "lagitude": null,
      "longitude": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "first name must be at least 3 characters long",
        "param": "fullname.firstname",
        "location": "body"
      },
      {
        "msg": "vehicle type must be one of car, bike, auto",
        "param": "vehicle.type",
        "location": "body"
      }
    ]
  }
  ```

#### Email Already Exists

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "message": "Captain with this email already exists"
  }
  ```

#### Server Error

- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "error": "Error message"
  }
  ```

### Postman Example

#### Request Setup
1. **Method:** POST
2. **URL:** `http://localhost:3000/captains/register`
3. **Headers:**
   ```
   Content-Type: application/json
   ```
4. **Body (raw JSON):**
   ```json
   {
     "fullname": {
       "firstname": "John",
       "lastname": "Doe"
     },
     "email": "john.doe@example.com",
     "password": "yourpassword",
     "vehicle": {
       "color": "White",
       "plate": "ABC123",
       "capacity": 4,
       "type": "car"
     }
   }
   ```

#### Expected Response
- **Status:** 201 Created
- **Response Body:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY4YTFiMmMzZDRlNWY2YTdiOGM5ZDAiLCJpYXQiOjE3MzQ5NzI2MDAsImV4cCI6MTczNDk3NjIwMH0.example",
    "newCaptain": {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "status": "inactive",
      "vehicle": {
        "color": "White",
        "plate": "ABC123",
        "capacity": 4,
        "type": "car"
      },
      "lagitude": null,
      "longitude": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

### Example curl Request

```sh
curl -X POST http://localhost:3000/captains/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "yourpassword",
    "vehicle": {
      "color": "White",
      "plate": "ABC123",
      "capacity": 4,
      "type": "car"
    }
  }'
```

---

## Captain Login

## /captains/login

### Description

Login an existing captain using email and password.  
Returns a JWT token and captain details on successful authentication.

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

### Field Requirements

| Field    | Type   | Required | Validation                    |
| -------- | ------ | -------- | ----------------------------- |
| email    | String | Yes      | Must be a valid email address |
| password | String | Yes      | Minimum 6 characters          |

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "token": "<JWT_TOKEN>",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      // ...other fields
    }
  }
  ```

#### Invalid Credentials

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "message": "Captain with this email does not exist" // or "Invalid password"
  }
  ```

#### Validation Error

- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field",
        "location": "body"
      }
    ]
  }
  ```

#### Server Error

- **Status Code:** `500 Internal Server Error`
- **Body:**
  ```json
  {
    "error": "Error message"
  }
  ```

---

## Captain Profile

## /captains/profile

### Description

Get the profile of the currently authenticated captain.  
Requires a valid JWT token (sent as a cookie or in the `Authorization` header).

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other fields
    }
  }
  ```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Unauthorized access, please login first"
  }
  ```

---

## Captain Logout

## /captains/logout

### Description

Logs out the current captain by blacklisting their JWT token.  
After logout, the token cannot be used for authentication anymore.

### Route

**GET** `/captains/logout`  
_(Requires authentication; send token as cookie or Authorization header)_

### How it works

- The current JWT token is added to the `blacklistToken` collection in the database.
- The token is set to expire automatically after **1 day** (24 hours) using MongoDB's TTL index.
- The `token` cookie is cleared from the client.

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Unauthorized

- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Unauthorized access, please login first"
  }
  ```

---

## Notes

- All fields are required for registration and login.
- Passwords are hashed before storing.
- On success, a JWT token is returned for authentication.
- Logout blacklists the token for 1 day (after which it is auto-removed).
