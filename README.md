# User Registration API Documentation

## Endpoint

**POST** `/users/register`

---

## Description

Register a new user by providing their full name, email, and password.  
The backend validates all fields and returns a JWT token on successful registration.

---

## Request Body

Send a JSON object in this format:

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

---

## Responses

### Success

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

### Validation Error

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

### Server Error

- **Status Code:** `500 Internal Server Error`
- **Body:**
    ```json
    {
      "error": "Error message"
    }
    ```

---

## Example Request (using curl)

```sh
curl -X POST http://localhost:3000/users/register \
-H "Content-Type: application/json" \
-d '{
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}'
```

---

## Notes

- All fields are required.
- Passwords are hashed before storing.
- On success, a JWT token is returned for authentication.