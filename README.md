# User Registration & Login API Documentation

## Endpoints

- **POST** `/users/register` — Register a new user  
- **POST** `/users/login` — Login with email and password

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

## Example Login Request (using curl)

```sh
curl -X POST http://localhost:3000/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}'
```

---

## Notes

- All fields are required.
- Passwords are hashed before storing.
- On success, a JWT token is returned for authentication.