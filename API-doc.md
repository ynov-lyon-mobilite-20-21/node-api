<!-- markdownlint-disable MD012 -->
# API documentation

- [API documentation](#api-documentation)
    - [Authentication](#authentication)
        - [Register](#register)
        - [Login](#login)
        - [Refresh Token](#refresh-token)
        - [Logout](#logout)
    - [Events](#events)
        - [Create](#create)
        - [Read All](#read-all)
        - [Read One by ID](#read-one-by-id)
        - [Update One by ID](#update-one-by-id)
        - [Delete One by ID](#delete-one-by-id)
    - [Tickets](#tickets)
        - [Create](#create)
        - [Read All](#read-all)
        - [Read One by ID](#read-one-by-id)
        - [Update One by ID](#update-one-by-id)
        - [Delete One by ID](#delete-one-by-id)


&nbsp; <!-- break line -->

## Authentication

### Register

> User account creation.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users`

**Authentication required** : `true`

**Method** : `POST`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| firstName | unspecified | unspecified | string | unspecified |
| lastName | unspecified | unspecified | string | unspecified |
| mail | unspecified | unspecified | string | unspecified |
| password | unspecified | unspecified | string | unspecified |
| promotion | unspecified | unspecified | string | unspecified |
| formation | unspecified | unspecified | string | unspecified |

### Return

200 OK

Errors:
- If no email field or empty : 400 Bad Request 'EMAIL_REQUIRED'
- If no password field or emptu : 400 Bad Request 'PASSWORD_REQUIRED'
- If no firstname field or empty : 400 Bad Request 'FIRSTNAME_REQUIRED'
- If no lastname field or empty : 400 Bad Request 'LASTNAME_REQUIRED'
- If no promotion field or empty : 400 Bad Request 'PROMOTION_REQUIRED'
- If no formation field or empty : 400 Bad Request 'FORMATION_REQUIRED'
- If user already exist and active : 400 Bad Request 'USER_ALREADY_EXISTS'
- If user already exist but not active : 400 Bad Request 'USER_ALREADY_EXISTS'
- If couldn't create user in database : 400 Bad Request 'UNKNOWN_ERROR'
- If another error occurs : 400 Bad Request 'UNKNOWN_ERROR'

---

### Login

> Description unspecified.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth/login`

**Authentication required** : `true`

**Method** : `POST`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| mail | unspecified | unspecified | string | unspecified |
| password | unspecified | unspecified | string | unspecified |



### Return

200 OK

Errors:
- If no account for these credentials : 400 Bad Request 'NO_USER'
- If user isn't active : 403 Forbidden 'USER_INACTIVE'
- If bad credentials : 401 Unauthorized 'BAD_CREDENTIALS'


---

### Refresh Token

> Generate new Token when it expire with the Refresh Token

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth/refreshToken`

**Authentication required** : `true`

**Method** : `POST`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| refreshToken | unspecified | unspecified | string | unspecified |



#### Return

200 OK

Errors:
- If refresh token doesn't exist, inactive or already expire : 400 Bad Request 'INVALID_TOKEN'
- If no user found with this token : 404 Not Found 'USER_DOESNT_EXIST'


---

### Logout

> Delete the Refresh Token associated to the user account.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth/logout`

**Authentication required** : `true`

**Method** : `POST`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| refreshToken | unspecified | unspecified | string | unspecified |



#### Return

200 OK

Error:
- If impossible to delete the refresh token : 500 Internal server error 'UNKNOWN_ERROR'

---



&nbsp; <!-- break line -->

## Events

### Create

> Create new event.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events`

**Authentication required** : `true`

**Method** : `POST`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| name | unspecified | unspecified | string | unspecified |
| type | unspecified | unspecified | string | unspecified |
| date | unspecified | unspecified | string | unspecified |
| address | unspecified | unspecified | string | unspecified |
| description | unspecified | unspecified | string | unspecified |
| price | unspecified | unspecified | string | unspecified |
| qrcode | unspecified | unspecified | string | unspecified |


#### Return

200 OK

Errors:
- If no field name or empty : 400 Bad Request 'NAME_REQUIRED'
- If no field type or empty : 400 Bad Request 'TYPE_REQUIRED'
- If no field date or empty : 400 Bad Request 'DATE_REQUIRED'
- If no field address or empty : 400 Bad Request 'ADDRESS_REQUIRED'
- If no field description or empty : 400 Bad Request 'DESCRIPTION_REQUIRED'
- If no field price or empty : 400 Bad Request 'PRICE_REQUIRED'
- If no field qrcode or empty : 400 Bad Request 'QRCODE_REQUIRED'
- If event already exist : 400 Bas Request 'EVENT_ALREADY_EXISTS'
- If couldn't save event : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Read All

> Get all registered events

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events`

**Authentication required** : `true`

**Method** : `GET`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
No body required for this request.



#### Return

200 OK

---

### Read One by ID

> Get data of one event by ID

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/event/5fa6e22f6c03342d44461886`

**Authentication required** : `true`

**Method** : `GET`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
No body required for this request.



#### Return

200 OK

---

### Update One by ID

> Update data of one event by giving it ID

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/event/5fa6e22f6c03342d44461886`

**Authentication required** : `true`

**Method** : `PUT`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| name | unspecified | unspecified | string | unspecified |



#### Return

200 OK

Errors:
- If couldn't save data : 500 Internal Server Error 'UNKNOWN_ERROR'
---

### Delete One by ID

> Delete one Event by giving it ID

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/event/5fa6e22f6c03342d44461886`

**Authentication required** : `true`

**Method** : `DELETE`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
No body required for this request.



#### Return

200 OK

Errors:
- If couldn't save data : 500 Internal Server Error 'UNKNOWN_ERROR'

---



&nbsp; <!-- break line -->

## Tickets

### Create

> Allows you to create a ticket from the BackOffice.
You must be an administrator to access this route.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/tickets`

**Authentication required** : `true`

**Method** : `POST`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| userId | unspecified | unspecified | string | unspecified |
| eventId | unspecified | unspecified | string | unspecified |
| paymentId | unspecified | unspecified | string | unspecified |



#### Return

200 OK

Errors:
- If no field or empty userid : 400 Bad Request 'USERID_REQUIRED'
- If no field or empty eventid : 400 Bad Request 'EVENTID_REQUIRED'
- If no field or empty paymentid : 400 Bad Request 'PAYMENTID_REQUIRED'
- If ticket already exist : 400 Bad Request 'TICKET_ALREADY_EXISTS"

---

### Read All

> Allows to retrieve all the tickets of the current user thanks to his token.
You must be an administrator to access this route.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/tickets`

**Authentication required** : `true`

**Method** : `GET`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
No body required for this request.



#### Return

200 OK

---

### Read One by ID

> Allows to retrieve the information of a specific ticket thanks to the ticket ID.
You must be an administrator to access this route.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/5fa6e2766c03342d4446188a`

**Authentication required** : `true`

**Method** : `GET`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
No body required for this request.



#### Return

200 OK

---

### Update One by ID

> Allows you to update / edit a ticket thanks to your id.
You must be an administrator to access this route.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/5fa6e2766c03342d4446188a`

**Authentication required** : `true`

**Method** : `PUT`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| paymentId | unspecified | unspecified | string | unspecified |



#### Return

200 OK

Errors:
- If couldn't save data : 500 Internal Server Error 'UNKNOWN_ERROR'


---

### Delete One by ID

> Allows you to delete a ticket by its ID.
You must be an administrator to access this route.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/5fa6e2766c03342d4446188a`

**Authentication required** : `true`

**Method** : `DELETE`




#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | Unspecified |  |
| Authorization | bearer TOKEN | Unspecified |  |



#### Body
No body required for this request.



#### Return

200 OK

Errors:
- If couldn't delete data : 500 Internal Server Error 'UNKNOWN_ERROR'


---



&nbsp; <!-- break line -->

