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
        - [Read One by ID](#read-one by id)
        - [Update One by ID](#update-one by id)
        - [Delete One by ID](#delete-one by id)
    - [Tickets](#tickets)
        - [Create](#create)
        - [Read All](#read-all)
        - [Read One by ID](#read-one by id)
        - [Update One by ID](#update-one by id)
        - [Delete One by ID](#delete-one by id)


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

---

### Login

> Description unspecified.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth`

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

---

### Refresh Token

> Generate new Token when it expire with the Refresh Token

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth/refresh`

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

---

### Logout

> Delete the Refresh Token associated to the user account.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/logout`

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

---



&nbsp; <!-- break line -->

