<!-- markdownlint-disable MD012 -->
# API documentation

- [API documentation](#api-documentation)
  - [Authentication](#authentication)
    - [Register](#register)
      - [Headers](#headers)
      - [Body](#body)
      - [Returns](#returns)
    - [Login](#login)
      - [Headers](#headers-1)
      - [Body](#body-1)
      - [Returns](#returns-1)
    - [Refresh Token](#refresh-token)
      - [Headers](#headers-2)
      - [Body](#body-2)
      - [Returns](#returns-2)
    - [Logout](#logout)
      - [Headers](#headers-3)
      - [Body](#body-3)
      - [Returns](#returns-3)
  - [Users](#users)
    - [Create (same as Authentication/Register)](#create-same-as-authenticationregister)
      - [Headers](#headers-4)
      - [Body](#body-4)
      - [Returns](#returns-4)
    - [Read Current User](#read-current-user)
      - [Headers](#headers-5)
      - [Body](#body-5)
      - [Returns](#returns-5)
    - [Read All](#read-all)
      - [Headers](#headers-6)
      - [Body](#body-6)
      - [Returns](#returns-6)
    - [Read One by ID](#read-one-by-id)
      - [Headers](#headers-7)
      - [Body](#body-7)
      - [Returns](#returns-7)
    - [Update Current User](#update-current-user)
      - [Headers](#headers-8)
      - [Body](#body-8)
      - [Returns](#returns-8)
    - [Update One by ID](#update-one-by-id)
      - [Headers](#headers-9)
      - [Body](#body-9)
      - [Returns](#returns-9)
    - [Delete Current User](#delete-current-user)
      - [Headers](#headers-10)
      - [Body](#body-10)
      - [Returns](#returns-10)
    - [Delete One by ID](#delete-one-by-id)
      - [Headers](#headers-11)
      - [Body](#body-11)
      - [Returns](#returns-11)
    - [Activate account](#activate-account)
      - [Headers](#headers-12)
      - [Body](#body-12)
      - [Returns](#returns-12)
  - [Events](#events)
    - [Create](#create)
      - [Headers](#headers-13)
      - [Body](#body-13)
      - [Returns](#returns-13)
    - [Read All](#read-all-1)
      - [Headers](#headers-14)
      - [Body](#body-14)
      - [Returns](#returns-14)
    - [Read One by ID](#read-one-by-id-1)
      - [Headers](#headers-15)
      - [Body](#body-15)
      - [Returns](#returns-15)
    - [Update One by ID](#update-one-by-id-1)
      - [Headers](#headers-16)
      - [Body](#body-16)
      - [Returns](#returns-16)
    - [Delete One by ID](#delete-one-by-id-1)
      - [Headers](#headers-17)
      - [Body](#body-17)
      - [Returns](#returns-17)
    - [Pay](#pay)
      - [Headers](#headers-18)
      - [Body](#body-18)
      - [Returns](#returns-18)
  - [Payment (Stripe)](#payment-stripe)
    - [Register new credit card on Stripe service](#register-new-credit-card-on-stripe-service)
      - [Headers](#headers-19)
      - [Body (Form URL Encoded)](#body-form-url-encoded)
      - [Returns](#returns-19)
    - [Create new Stripe credit card for current user](#create-new-stripe-credit-card-for-current-user)
      - [Headers](#headers-20)
      - [Body](#body-19)
      - [Returns](#returns-20)
    - [Read All cards of current user](#read-all-cards-of-current-user)
      - [Headers](#headers-21)
      - [Body](#body-20)
      - [Returns](#returns-21)
    - [Update default credit card of current user](#update-default-credit-card-of-current-user)
      - [Headers](#headers-22)
      - [Body](#body-21)
      - [Returns](#returns-22)
    - [Delete a card by ID of the current user](#delete-a-card-by-id-of-the-current-user)
      - [Headers](#headers-23)
      - [Body](#body-22)
      - [Returns](#returns-23)
    - [_New Payement_](#new-payement)
      - [Headers](#headers-24)
      - [Body](#body-23)
  - [Tickets](#tickets)
    - [Create](#create-1)
      - [Headers](#headers-25)
      - [Body](#body-24)
      - [Returns](#returns-24)
    - [Read All of Current User](#read-all-of-current-user)
      - [Headers](#headers-26)
      - [Body](#body-25)
      - [Returns](#returns-25)
    - [Read All](#read-all-2)
      - [Headers](#headers-27)
      - [Body](#body-26)
      - [Returns](#returns-26)
    - [Read One by ID of Current User](#read-one-by-id-of-current-user)
      - [Headers](#headers-28)
      - [Body](#body-27)
      - [Returns](#returns-27)
  - [- If an error occurs while updating the card in database : 500 Internal Server Error 'UNKNOWN_ERROR'](#--if-an-error-occurs-while-updating-the-card-in-database--500-internal-server-error-unknown_error)
    - [Read One by ID](#read-one-by-id-2)
      - [Headers](#headers-29)
      - [Body](#body-28)
      - [Returns](#returns-28)
    - [Update One by ID](#update-one-by-id-2)
      - [Headers](#headers-30)
      - [Body](#body-29)
      - [Returns](#returns-29)
    - [Delete One by ID](#delete-one-by-id-2)
      - [Headers](#headers-31)
      - [Body](#body-30)
      - [Returns](#returns-30)
    - [Check](#check)
      - [Headers](#headers-32)
      - [Body](#body-31)
      - [Returns](#returns-31)


&nbsp; <!-- break line -->

## Authentication

### Register

> User account creation.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users`

**Authentication required** : `false`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| firstName | yes | none | string | User firstName to create his account. |
| lastName | yes | none | string | User lastName to create his account. |
| mail | yes | none | string | User mail to create his account. |
| password | yes | none | string | User password to create his account. |
| promotion | yes | none | string | User promotion to create his account. |
| formation | yes | none | string | User formation to create his account. |



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isActive": false,
    "isAdmin": false,
    "isAdherent": false,
    "_id": "",
    "mail": "",
    "firstName": "",
    "lastName": "",
    "promotion": "",
    "formation": "",
    "registrationDate": ""
  }
}
```

Errors:
- If give unexpected fields : 400 Bad Request 'MALFORMED_JSON'
- If no mail field or empty : 400 Bad Request 'EMAIL_REQUIRED'
- If no password field or emptu : 400 Bad Request 'PASSWORD_REQUIRED'
- If no firstname field or empty : 400 Bad Request 'FIRSTNAME_REQUIRED'
- If no lastname field or empty : 400 Bad Request 'LASTNAME_REQUIRED'
- If no promotion field or empty : 400 Bad Request 'PROMOTION_REQUIRED'
- If no formation field or empty : 400 Bad Request 'FORMATION_REQUIRED'
- If an error occurs on sendInactiveUserAccountExistMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If user already exist but not active : 400 Bad Request 'USER_INACTIVE'
- If user already exist and active : 400 Bad Request 'USER_ALREADY_EXISTS'
- If user already exist but not active and active at the same time : 500 Internal Server Error 'UNKNOWN_ERROR'
- If an error occurs on sendRegistrationMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If couldn't save the user in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Login

> Login user with email and password to get Tokens.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth/login`

**Authentication required** : `false`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| mail | yes | none | string | User email to get logged in. |
| password | yes | none | string | User password to get logged in. |



#### Returns

200 OK
```json
{
    "error": null,
    "data": {
        "token": "",
        "refreshToken": ""
    }
}
```

Errors:
- If user not found with this email : 400 Bad Request 'UNKNOWN_USER'
- If user is inactive and an error occurs while trying to update user before send activation email : 500 Internal Server Error 'UNKNOWN_ERROR'
- If user is inactive and an error occurs on sendInactiveUserAccountExistMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If user already exist but not active : 400 Bad Request 'USER_INACTIVE'
- If user password is incorrect : 400 Bad Request 'BAD_CREDENTIALS'
- If a error occurs while generating refresh token : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Refresh Token

> Generate new Token when it expire with the Refresh Token.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth/refreshToken`

**Authentication required** : `false`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| refreshToken | yes | none | string | The refresh token key to generate new tokens |



#### Returns

200 Ok
```json
{
    "error": null,
    "data": {
      "token": "",
      "refreshToken": ""
    }
}
```

Errors:
- If there is no field refreshToken or empty : 400 Bad Request 'REFRESH_TOKEN_REQUIRED'
- If it's impossible to get refresh token obj from database with the given token : 404 Not Found'TOKEN_NOT_FOUND'
- If it's impossible to get user attach to the refresh token : 400 Bad Request 'USER_NOT_FOUND'
- If a error occurs while generating refresh token : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Logout

> Delete the Refresh Token associated to the user account.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/auth/logout`

**Authentication required** : `true`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| refreshToken | unspecified | unspecified | string | unspecified |



#### Returns

204 No Content

Errors:
- If there is no field refreshToken or empty : 400 Bad Request 'REFRESH_TOKEN_REQUIRED'

---

&nbsp; <!-- break line -->

## Users

### Create (same as Authentication/Register)

> User account creation.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users`

**Authentication required** : `false`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| firstName | yes | none | string | User firstName to create his account. |
| lastName | yes | none | string | User lastName to create his account. |
| mail | yes | none | string | User mail to create his account. |
| password | yes | none | string | User password to create his account. |
| promotion | yes | none | string | User promotion to create his account. |
| formation | yes | none | string | User formation to create his account. |



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isActive": false,
    "isAdmin": false,
    "isAdherent": false,
    "_id": "",
    "mail": "",
    "firstName": "",
    "lastName": "",
    "promotion": "",
    "formation": "",
    "registrationDate": ""
  }
}
```

Errors:
- If give unexpected fields : 400 Bad Request 'MALFORMED_JSON'
- If no mail field or empty : 400 Bad Request 'EMAIL_REQUIRED'
- If no password field or emptu : 400 Bad Request 'PASSWORD_REQUIRED'
- If no firstname field or empty : 400 Bad Request 'FIRSTNAME_REQUIRED'
- If no lastname field or empty : 400 Bad Request 'LASTNAME_REQUIRED'
- If no promotion field or empty : 400 Bad Request 'PROMOTION_REQUIRED'
- If no formation field or empty : 400 Bad Request 'FORMATION_REQUIRED'
- If an error occurs on sendInactiveUserAccountExistMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If user already exist but not active : 400 Bad Request 'USER_INACTIVE'
- If user already exist and active : 400 Bad Request 'USER_ALREADY_EXISTS'
- If user already exist but not active and active at the same time : 500 Internal Server Error 'UNKNOWN_ERROR'
- If an error occurs on sendRegistrationMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If couldn't save the user in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Read Current User

> Prerequisites : **[Connected]**
>
> Get current user informations according to it token.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users/me`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isActive": true,
    "isAdmin": false,
    "isAdherent": false,
    "_id": "",
    "mail": "",
    "firstName": "",
    "lastName": "",
    "promotion": "",
    "formation": ""
  }
}
```

No errors are returned.

---

### Read All

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Get all users with their informations registered on the app.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.



#### Returns

200 Ok
```json
{
  "error": null,
  "data": [
    {
      "isActive": true,
      "isAdmin": true,
      "isAdherent": false,
      "_id": "",
      "mail": "",
      "firstName": "",
      "lastName": "",
      "promotion": "",
      "formation": ""
    },
    {
      "isActive": true,
      "isAdmin": false,
      "isAdherent": false,
      "_id": "",
      "mail": "",
      "firstName": "",
      "lastName": "",
      "promotion": "",
      "formation": ""
    }
  ]
}
```

No error returned.

---

### Read One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Get one user by ID with it informations registered on the app.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users/USER_ID`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isActive": true,
    "isAdmin": false,
    "isAdherent": false,
    "_id": "",
    "mail": "",
    "firstName": "",
    "lastName": "",
    "promotion": "",
    "formation": ""
  }
}
```

Errors:
- If no id field or empty : 400 Bad Request 'USER_ID_REQUIRED'
- If user didn't find with this id : 404 Not Found 'UNKNOWN_USER'

---

### Update Current User

> Prerequisites : **[Connected]**
>
> Update current user informations.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users`

**Authentication required** : `true`

**Method** : `PUT`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route. |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| firstName | Only one field is required | none | string | User firstName field which you want to replace the value. |
| lastName | Only one field is required | none | string | User lastName field which you want to replace the value. |
| mail | Only one field is required | none | string | User mail field which you want to replace the value. |
| password | Only one field is required | none | string | User password field which you want to replace the value. |
| promotion | Only one field is required | none | string | User promotion field which you want to replace the value. |
| formation | Only one field is required | none | string | User formation field which you want to replace the value. |



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isActive": true,
    "isAdmin": false,
    "isAdherent": false,
    "_id": "",
    "mail": "",
    "firstName": "",
    "lastName": "",
    "promotion": "",
    "formation": ""
  }
}
```

Errors:
- If give unexpected fields : 400 Bad Request 'MALFORMED_JSON'
- If no mail field or empty : 400 Bad Request 'EMAIL_REQUIRED'
- If no password field or emptu : 400 Bad Request 'PASSWORD_REQUIRED'
- If no firstname field or empty : 400 Bad Request 'FIRSTNAME_REQUIRED'
- If no lastname field or empty : 400 Bad Request 'LASTNAME_REQUIRED'
- If no promotion field or empty : 400 Bad Request 'PROMOTION_REQUIRED'
- If no formation field or empty : 400 Bad Request 'FORMATION_REQUIRED'
- If an error occurs on sendInactiveUserAccountExistMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If user already exist but not active : 400 Bad Request 'USER_INACTIVE'
- If user already exist and active : 400 Bad Request 'USER_ALREADY_EXISTS'
- If user already exist but not active and active at the same time : 500 Internal Server Error 'UNKNOWN_ERROR'
- If an error occurs on sendRegistrationMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If couldn't save the user in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Update One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Update user informations by ID.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users/USER_ID`

**Authentication required** : `true`

**Method** : `PUT`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| firstName | Only one field is required | none | string | User firstName field which you want to replace the value. |
| lastName | Only one field is required | none | string | User lastName field which you want to replace the value. |
| mail | Only one field is required | none | string | User mail field which you want to replace the value. |
| password | Only one field is required | none | string | User password field which you want to replace the value. |
| promotion | Only one field is required | none | string | User promotion field which you want to replace the value. |
| formation | Only one field is required | none | string | User formation field which you want to replace the value. |



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isActive": true,
    "isAdmin": false,
    "isAdherent": false,
    "_id": "",
    "mail": "",
    "firstName": "",
    "lastName": "",
    "promotion": "",
    "formation": ""
  }
}
```

Errors:
- If give unexpected fields : 400 Bad Request 'MALFORMED_JSON'
- If no mail field or empty : 400 Bad Request 'EMAIL_REQUIRED'
- If no password field or emptu : 400 Bad Request 'PASSWORD_REQUIRED'
- If no firstname field or empty : 400 Bad Request 'FIRSTNAME_REQUIRED'
- If no lastname field or empty : 400 Bad Request 'LASTNAME_REQUIRED'
- If no promotion field or empty : 400 Bad Request 'PROMOTION_REQUIRED'
- If no formation field or empty : 400 Bad Request 'FORMATION_REQUIRED'
- If an error occurs on sendInactiveUserAccountExistMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If user already exist but not active : 400 Bad Request 'USER_INACTIVE'
- If user already exist and active : 400 Bad Request 'USER_ALREADY_EXISTS'
- If user already exist but not active and active at the same time : 500 Internal Server Error 'UNKNOWN_ERROR'
- If an error occurs on sendRegistrationMail() : 500 Internal Server Error 'UNKNOWN_ERROR'
- If couldn't save the user in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Delete Current User

> Prerequisites : **[Connected]**
>
> Update current user informations.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users`

**Authentication required** : `true`

**Method** : `DELETE`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.



#### Returns

204 No Content

Errors:
- If no user deleted : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Delete One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Update user informations by ID.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users/USER_ID`

**Authentication required** : `true`

**Method** : `DELETE`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.



#### Returns

204 No Content

Errors:
- If no user deleted : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Activate account

> This route is to validate the user email and redirect to the app after.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/users/activate/ACTIVATION_TOKEN`

**Authentication required** : `false`

**Method** : `GET`


#### Headers
No headers specified.



#### Body
No body required for this request.



#### Returns

302 Found => redirect to the universal app link

Errors:
- If activationKey is missing in request parameters : 400 Bad Request 'ACTIVATION_KEY_REQUIRED'
- If no user found with the activationKey : 400 Bad Request 'INVALID_ACTIVATION_KEY'
- If the user found is already activated : 400 Bad Request 'ACCOUNT_ALREADY_ACTIVATED'
- If an error occurs while creating stripe customer : 500 Bad Request 'UNKNOWN_STRIPE_ERROR'
- If an error occurs while saving the validation data to user in database : 500 Bad Request 'UNKNOWN_ERROR'

---



&nbsp; <!-- break line -->

## Events

### Create

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Create new event.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events`

**Authentication required** : `true`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| name | yes | none | string | The event name. |
| type | yes | none | enum of string | The event type. It's an enum of string. Available values are : `'Call Kolok', 'Soirée Etudiante', 'LAN', 'Un moment sportif', 'Vente de nourriture'` |
| imgType | yes | none | enum of string | The image event type. It's an enum of string. Available values are : `'card_KOLOK', 'card_PARTY', 'card_LAN', 'card_SPORT', 'card_FOOD'` |
| date | yes | none | string | The date on which the event is scheduled. It can be in the format of stringify date object or it unix value in milliseconds. |
| address | yes | none | string | The event postal address. |
| description | yes | none | string | The event description. |
| price | yes | none | string | The event ticket base price. It need to be a string of the ticket price value in cents. (ex: 100 = 1$) |



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "_id": "",
    "name": "",
    "type": "",
    "imgType": "",
    "date": "",
    "address": "",
    "description": "",
    "price": 0
  }
}
```

Errors:
- If give unexpected fields : 400 Bad Request 'MALFORMED_JSON'
- If no name field or empty : 400 Bad Request 'NAME_REQUIRED'
- If no type field or emptu : 400 Bad Request 'TYPE_REQUIRED'
- If no imgType field or empty : 400 Bad Request 'IMG_TYPE_REQUIRED'
- If no date field or empty : 400 Bad Request 'DATE_REQUIRED'
- If no address field or empty : 400 Bad Request 'ADDRESS_REQUIRED'
- If no description field or empty : 400 Bad Request 'DESCRIPTION_REQUIRED'
- If no price field or empty : 400 Bad Request 'PRICE_REQUIRED'
- If an event already registered with the same name : 400 Bad Request 'EVENT_ALREADY_EXISTS'
- If an error occurs while saving event in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Read All

> Prerequisites : **[Connected]**
>
> Get all registered events

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events`

**Authentication required** : `false`

**Method** : `GET`


#### Headers
No headers specified.


#### Body
No body required for this request.



#### Returns

200 Ok
```json
{
  "error": null,
  "data": [
    {
      "_id": "",
      "name": "",
      "type": "",
      "imgType": "",
      "date": "",
      "address": "",
      "description": "",
      "price": 0
    },
    {
      "_id": "",
      "name": "",
      "type": "",
      "imgType": "",
      "date": "",
      "address": "",
      "description": "",
      "price": 0
    },
    {
      "_id": "",
      "name": "",
      "type": "",
      "imgType": "",
      "date": "",
      "address": "",
      "description": "",
      "price": 0
    },
  ]
}
```

No errors returned.

---

### Read One by ID

> Prerequisites : **[Connected]**
>
> Get data of one event by ID

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events/EVENT_ID`

**Authentication required** : `false`

**Method** : `GET`


#### Headers
No headers specified.



#### Body
No body required for this request.



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "_id": "",
    "name": "",
    "type": "",
    "imgType": "",
    "date": "",
    "address": "",
    "description": "",
    "price": 0
  }
}
```

Errors:
- If no id in URL prameters : 400 Bad Request 'EVENT_ID_REQUIRED'
- If no event find with the event : 400 Bad Request 'EVENT_NOT_FOUND'

---

### Update One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Update data of one event by giving it ID

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events/EVENT_ID`

**Authentication required** : `true`

**Method** : `PUT`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| name | yes | none | string | The event name. Only one field is required |
| type | yes | none | enum of string | The event type. It's an enum of string. Available values are : `'Call Kolok', 'Soirée Etudiante', 'LAN', 'Un moment sportif', 'Vente de nourriture'` Only one field is required |
| imgType | yes | none | enum of string | The image event type. It's an enum of string. Available values are : `'card_KOLOK', 'card_PARTY', 'card_LAN', 'card_SPORT', 'card_FOOD'` Only one field is required |
| date | yes | none | string | The date on which the event is scheduled. It can be in the format of stringify date object or it unix value in milliseconds. Only one field is required |
| address | yes | none | string | The event postal address. Only one field is required |
| description | yes | none | string | The event description. Only one field is required |
| price | yes | none | string | The event ticket base price. It need to be a string of the ticket price value in cents. (ex: 100 = 1$) Only one field is required |



#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "_id": "",
    "name": "",
    "type": "",
    "imgType": "",
    "date": "",
    "address": "",
    "description": "",
    "price": 0
  }
}
```

Errors:
- If no eventId passed in URL parameters : 400 Bad Request 'EVENTID_REQUIRED'
- If give unexpected fields : 400 Bad Request 'MALFORMED_JSON'
- If an error occurs while saving the updated event in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Delete One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Delete one Event by giving it ID

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events/EVENT_ID`

**Authentication required** : `true`

**Method** : `DELETE`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

204 No Content

Errors:
- If no eventId passed in URL parameters : 400 Bad Request 'EVENTID_REQUIRED'
- If no user deleted : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Pay

> Prerequisites : **[Connected]**
>
> Alloy you to buy a ticket for the choosen event.
>
> It will create a new Stripe payment intent and save the payment + a new inactive ticket.
>
> Complete the payment with clientSecret string provided in response: https://stripe.com/docs/payments/accept-a-payment
>
> After the payment was completed, Stripe will notify the API and the ticket will be automaticly change to an active one. _It can take some times._

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/events/pay/EVENT_ID`

**Authentication required** : `true`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| cardId | no | The default user card if one is defined | string | This field allows you to start a payment with a specific card by passing it id. If no card id passed, the API will use the user default card if there is one. |
| basicPaymentFallback | no | `false` | boolean | Allow you to create a basic payment without invoice generation. |



#### Returns

200 Ok
```json
{
    "error": null,
    "data": {
        "paymentIntentId": "",
        "clientSecret": ""
    }
}
```

Errors:
- If no eventId passed in URL parameters : 400 Bad Request 'EVENT_ID_REQUIRED'
- If no event found with the eventId passed in URL parameters: 404 Not Found 'EVENT_NOT_FOUND'
- If no card found with the passed id : 400 Bad Request 'CARD_NOT_FOUND'
- If no user default card attach to user found : 400 Bad Request 'NO_CARDS_AVAILABLE'
- If an error occurs while creating stripe payment intent : 400 Bad Request 'UNKNOWN_ERROR'
- If an error occurs while saving stripe payment intent in database : 500 Internal Server Error 'UNKNOWN_ERROR'
- If an error occurs while confirm stripe payment intent : 500 Internal Server Error 'UNKNOWN_ERROR'
- If an error occurs while saving ticket in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---



&nbsp; <!-- break line -->

## Payment (Stripe)

### Register new credit card on Stripe service

> This route allows you to register a new credit card on the Stripe service.
> It will give you the necessary information to register it on our application.
>
> Use the `_id` of the object given, **not the card object**, to create stripe credit card for the current user.

**URI** : `https://api.stripe.com/v1/tokens`

**Authentication required** : `true`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | Basic with api key as user | yes | Allow you to prove that you have the authorization to access to this route |



#### Body (Form URL Encoded)
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| card[number] | yes | none | string | The card numbers. |
| card[exp_month] | yes | none | string | The card expiration month. |
| card[exp_year] | yes | none | string | The card expiration year. |
| card[cvc] | yes | none | string | The card cvc. |
| card[name] | yes | none | string | The card name. |



#### Returns

200 OK
```json
{
  "id": "",
  "object": "",
  "card": {
    "id": "",
    "object": "",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "",
    "country": "",
    "cvc_check": "",
    "dynamic_last4": null,
    "exp_month": 10,
    "exp_year": 2000,
    "funding": "",
    "last4": "",
    "name": "",
    "tokenization_method": null
  },
  "client_ip": "",
  "created": 1615409218,
  "livemode": false,
  "type": "card",
  "used": false
}
```

Please refer to strip API documentation for errors : https://stripe.com/docs/api/

---

### Create new Stripe credit card for current user

> Prerequisites : **[Connected]**
>
> This route allow you to link a new stripe card to the current user.
>
> User `_id` of previous route has `stripeId`.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/stripe/credit-cards`

**Authentication required** : `true`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| stripeId | yes | none | string | Ths field `_id` of the object returned by the stripe api [Register new credit card on Stripe service](#register-new-credit-card-on-stripe-service) |


#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isDefaultCard": false,
    "_id": "",
    "stripeId": "",
    "userId": "",
    "name": "",
    "last4": "",
    "expMonth": 12,
    "expYear": 2021,
    "brand": ""
  }
}
```

Errors:
- If the field stripeId is missing or empty : 400 Bad Request 'CARD_STRIPE_ID_REQUIRED'
- If the card id is already saved in our database and linked to the user : 400 Bad Request 'CARD_ALREADY_LINKED'
- If an error occurs while link the card to the customer : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Read All cards of current user

> Prerequisites : **[Connected]**
>
> This route allow you to get all cards registered to the current user according to the token present in authorization header.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/stripe/credit-cards/me`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

200 Ok
```json
{
  "error": null,
  "data": [
      {
          "isDefaultCard": false,
          "_id": "",
          "stripeId": "",
          "userId": "",
          "name": "",
          "last4": "",
          "expMonth": 12,
          "expYear": 2021,
          "brand": ""
      },
      {
          "isDefaultCard": false,
          "_id": "",
          "stripeId": "",
          "userId": "",
          "name": "",
          "last4": "",
          "expMonth": 12,
          "expYear": 2021,
          "brand": ""
      }
  ]
}
```

No errors returned.

---

### Update default credit card of current user

> Prerequisites : **[Connected]** **[ADMIN]**
>
> This route allow you to set a default payment card for the current user according to token present in authorization header.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/stripe/credit-cards/set-default/CARD_ID`

**Authentication required** : `true`

**Method** : `PUT`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| cardId | yes | none | string | The API card id to set as default user card. |


#### Returns

204 No Content

Errors:
- If the field cardId is missing or empty : 400 Bad Request 'REQUIRED_CARD_ID_PARAMETER'
- If an error occurs while updating the card in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Delete a card by ID of the current user

> Prerequisites : **[Connected]**
>
> This route allow you to delete a payment card by ID for the current user according to token present in authorization header.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/stripe/credit-cards/CARD_ID`

**Authentication required** : `true`

**Method** : `DELETE`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

204 No Content

Errors:
- If the field cardId is missing or empty : 400 Bad Request 'REQUIRED_CARD_ID_PARAMETER'
- If an error occurs while delete the card in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### _New Payement_

> **DEPRICATED**
>
> This route is commented and deprecated. It remains documented and commented in the code for archiving.
>
> ---
>
> > Prerequisites : **[Connected]**
> >
> > Declare a new payment for the curent user.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/stripe/pay`

**Authentication required** : `true`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| cardId | unspecified | unspecified | string | unspecified |
| products | unspecified | unspecified | object | unspecified |

---



&nbsp; <!-- break line -->

## Tickets

### Create

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Allows to create a ticket manually.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/tickets`

**Authentication required** : `true`

**Method** : `POST`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| userId | yes | none | string | The user id. |
| eventId | yes | none | string | The event id. |
| paymentId | yes | none | string | null | The payment id. It can be null if there is no online payment. |


#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "validationCount": 0,
    "_id": "",
    "userId": "",
    "eventId": "",
    "paymentId": "" | null
  }
}
```

Errors:
- If the field userId is missing or empty : 400 Bad Request 'USER_ID_REQUIRED'
- If the field eventId is missing or empty : 400 Bad Request 'EVENT_ID_REQUIRED'
- If the field paymentId is missing or empty : 400 Bad Request 'PAYMENT_ID_REQUIRED'
- If a ticket with same data already exist : 400 Bad Request 'TICKET_ALREADY_EXISTS'
- If an error occurs while saving the ticket in database : 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Read All of Current User

> Prerequisites : **[Connected]**
>
> Allows to retrieve all the tickets of the current user thanks to his token.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/tickets/me`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

200 Ok
```json
{
  "error": null,
  "data": [
      {
          "validationCount": 0,
          "_id": "",
          "userId": "",
          "eventId": "",
          "paymentId": "" | null,
          "qrCodeString": "", // bde_{_id}
      },
      {
          "validationCount": 0,
          "_id": "",
          "userId": "",
          "eventId": "",
          "paymentId": "" | null,
          "qrCodeString": "", // bde_{_id}
      }
  ]
}
```

No error occurs.

---

### Read All

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Allows to retrieve all the tickets registered.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/tickets`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

200 Ok
```json
{
  "error": null,
  "data": [
      {
          "validationCount": 0,
          "_id": "",
          "userId": "",
          "eventId": "",
          "paymentId": "" | null,
          "qrCodeString": "", // bde_{_id}
      },
      {
          "validationCount": 0,
          "_id": "",
          "userId": "",
          "eventId": "",
          "paymentId": "" | null,
          "qrCodeString": "", // bde_{_id}
      }
  ]
}
```

No errors returned.

---

### Read One by ID of Current User

> Prerequisites : **[Connected]**
>
> Allows to retrieve the information of a specific ticket thanks to the ticket ID attach to the current token, thanks to his token.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/TICKET_ID/me`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isValid": false,
    "validationCount": 0,
    "_id": "",
    "userId": "",
    "eventId": "",
    "paymentId": "" | null,
    "qrCodeString": "", // bde_{_id}
  }
}
```

Errors:
- If the field ticketId is missing or empty : 400 Bad Request 'TICKET_ID_REQUIRED'
- If an error occurs while updating the card in database : 500 Internal Server Error 'UNKNOWN_ERROR'
---

### Read One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Allows to retrieve the information of a specific ticket thanks to the ticket ID.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/TICKET_ID`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isValid": false,
    "validationCount": 0,
    "_id": "",
    "userId": "",
    "eventId": "",
    "paymentId": "" | null,
    "qrCodeString": "", // bde_{_id}
  }
}
```

Errors:
- If the field ticketId is missing or empty : 400 Bad Request 'TICKET_ID_REQUIRED'

---

### Update One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Allows you to update / edit a ticket thanks to it id.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/TICKET_ID`

**Authentication required** : `true`

**Method** : `PUT`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Content-Type | application/json | No | Specify the body content type. This api accept only JSON. |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
| Key | Required | Default | Type | Description |
| --- | --- | --- | --- | --- |
| paymentId | unspecified | unspecified | string | unspecified |


#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "isValid": false,
    "validationCount": 0,
    "_id": "",
    "userId": "",
    "eventId": "",
    "paymentId": "" | null
  }
}
```

Errors:
- If the field ticketId is missing in URL parameters : 400 Bad Request 'TICKET_ID_REQUIRED'
- If give unexpected fields : 400 Bad Request 'MALFORMED_JSON'
- If no data given : 400 Bad Request 'NO_DATA'
- If an error occurs while updating the ticket in database: 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Delete One by ID

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Allows you to delete a ticket thanks to it id.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/TICKET_ID`

**Authentication required** : `true`

**Method** : `DELETE`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

204 No content

Errors:
- If an error occurs while updating the ticket in database: 500 Internal Server Error 'UNKNOWN_ERROR'

---

### Check

> Prerequisites : **[Connected]** **[ADMIN]**
>
> Allows to retrieve the information of a specific ticket thanks to the ticket ID.

**URI** : `https://lyon-ynov-bde-api.herokuapp.com/api/ticket/TICKET_ID/check`

**Authentication required** : `true`

**Method** : `GET`


#### Headers
| Key | Expected value | Required | Description |
| --- | --- | --- | --- |
| Authorization | `bearer TOKEN` | yes | Allow you to prove that you have the authorization to access to this route |



#### Body
No body required for this request.


#### Returns

200 Ok
```json
{
  "error": null,
  "data": {
    "ticket": {
      "isValid": false,
      "validationCount": 0,
      "_id": "",
      "userId": "",
      "eventId": "",
      "paymentId": "" | null,
    },
    "payment": {
      "buyOn": "",
      "amount": "", // `${amount} ${currency}`
      "paymentStatus": ""
    },
    "user": {
      "isActive": true,
      "isAdmin": false,
      "isAdherent": false,
      "_id": "",
      "mail": "",
      "firstName": "",
      "lastName": "",
      "promotion": "",
      "formation": ""
    }
  }
}
```

Errors:
- If the ticket id is missing in URL parameters : 400 Bad Request 'TICKET_ID_REQUIRED'
- If no ticket found with the ticket id given : 400 Bad Request 'TICKET_NOT_FOUND'
- If an error occurs whil trying to get payment object if there is one : 500 Internal Server Error 'UNKNOWN_ERROR'

---



&nbsp; <!-- break line -->

