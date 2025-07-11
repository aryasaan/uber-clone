# User Registration & Login API Documentation

## Endpoints

- **POST** `/users/register` — Register a new user  
- **POST** `/users/login` — Login with email and password  
- **GET** `/users/profile` — Get logged-in user's profile (requires authentication)  
- **GET** `/users/logout` — Logout user and blacklist current token

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

| Field                   | Type   | Required | Validation                                 |
|-------------------------|--------|----------|---------------------------------------------|
| fullname.firstname      | String | Yes      | Minimum 3 characters                       |
| fullname.lastname       | String | Yes      | Minimum 3 characters                       |
| email                   | String | Yes      | Must be a valid email address              |
| password                | String | Yes      | Minimum 6 characters                       |

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

| Field    | Type   | Required | Validation                      |
|----------|--------|----------|---------------------------------|
| email    | String | Yes      | Must be a valid email address   |
| password | String | Yes      | Minimum 6 characters            |

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

## Notes

- All fields are required for registration and login.
- Passwords are hashed before storing.
- On success, a JWT token is returned for authentication.
- Logout blacklists the token for 1 day (after which it is auto-removed).