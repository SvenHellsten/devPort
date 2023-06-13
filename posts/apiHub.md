# Authentication

To use the Aimo API Hub, the first thing you (your company) must do is register
with Aimo. Contact your Aimo representative or use the following
[form](https://aimopark.formstack.com/forms/samarbeta_med_aimo_park). Upon
registering as an Aimo API Hub client, you will be provisioned with client
credentials. These credentials will be used to authenticate requests you make to
the API. It is through this authentication process that we can:

• Verify that the traffic identifying itself as you is, in fact, you

• Establish your identity to the system

These credentials are unique to each integration on the platform and consists of
a client id and a client secret. When you have these, you can fetch your jwt by
accessing the authentication endpoint:

> <b>POST localhost:8000/auth/token </b>

```json
{
  "grantType": "client_credentials",
  "clientId": "1o23nh8th0832lh92d92l3",
  "clientSecret": "oien23ie42n3oi4e2n3oi4en239np2ysusny23nsyu9v3h"
}
```

This will return a Bearer token that can be used to access other endpoints.

The Aimo API Hub utilises HTTPS to securely transport data across the internet.
Only HTTPS is allowed; it is not possible to access the API using unsecured HTTP
calls.

# Zones

This endpoint returns a list of available parking zones available to the user.

> <b>GET /zones</b>

<b>Response:</b>

```json
{
  "zones": [
    {
      "id": "SE-120",
      "name": "Hötorget"
    },
    {
      "id": "SE-125",
      "name": "Gallerian"
    }
  ]
}
```

<h2>Availability</h2>
<p>To check availability at a zone, you should specify the start and stop time of the parking duration.</p>

<p>The endpoint will return the availability for each specific parking product that is available for the user at the specified zone. This productID is unique for each zone.</p>

> <b>GET
> /zones/{zone_id}/availability?productId=pmc-123&fromTime=2023-05-01T10:00:00Z&toTime=2023-05-01T12:00:00Z
> </b>

Parameters

| Name      | Description                     | Example              |
| --------- | ------------------------------- | -------------------- |
| productID | a specific productID (optional) | pmc-123              |
| fromTime  | starting time, in ISO 8601      | 2023-05-01T10:00:00Z |
| toTime    | ending time, in ISO 8601        | 2023-05-01T12:00:00Z |

Response

```json
{
  "id": "SE-120",
  "fromTime": "2023-05-01T10:00:00Z",
  "toTime": "2023-05-01T12:00:00Z",
  "products": [
    {
      "id": "pmc-123",
      "name": "basic",
      "availability": 20,
      "price": "60kr/h",
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 120
      }
    }
  ]
}
```

If there is not a specified product the call and subsequent response would be:

> <b>GET
> /zones/{zone_id}/availability?fromTime=2023-05-01T10:00:00Z&toTime=2023-05-01T12:00:00Z
> </b>

Response

```json
{
  "id": "SE-120",
  "fromTime": "2023-05-01T10:00:00Z",
  "toTime": "2023-05-01T12:00:00Z",
  "products": [
    {
      "id": "pmc-123",
      "name": "basicflexibleParking",
      "availability": 20,
      "price": "60kr/h",
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 120
      }
    },
    {
      "id": "pmc-456",
      "name": "premium",
      "availability": 3,
      "price": "80kr/h",
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 160
      }
    },
    {
      "id": "pmc-789",
      "name": "evParking",
      "availability": 2,
      "price": "100kr/h",
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 200
      }
    }
  ]
}
```

<h2>Booking</h2>
<p>To complete booking a permit you can use the booking endpoint</p>

> <b>POST zones/{zone_id}/booking
> </b>

Parameters:

| Name                    | Description                                                              | Example                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| productID               | a specific productID                                                     | pmc-123                                                                                                                                         |
| licenseplate            | contains the lienceplate object for the parker, Country code is optional | <pre>{<br> "countryCode": "S" //optional,<br> "text":"ABC123" <br>} </pre>                                                                      |
| fromTime                | starting time, in ISO 8601                                               | 2023-05-24T14:37:17Z                                                                                                                            |
| toTime                  | ending time, in ISO 8601                                                 | 2023-05-24T16:37:17Z                                                                                                                            |
| (_optional_) parkerData | contains an object with parker data                                      | <pre>{<br> "firstName": "Peter", <br> "lastName":"Parker",<br> "email":"peter.parker@aimo.com", <br> "phoneNumber": "+46701234567" <br>} </pre> |

Example Request body:

```json
{
  "productId": "PMC123",
  "licencePlate": {
    "countryCode": "S",
    "text": "ABC123"
  },
  "fromTime": "2023-05-24T16:37:17Z",
  "toTime": "2023-05-24T16:37:17Z",
  "parker": {
    "firstName": "Peter",
    "lastName": "Parker",
    "email": "parker.parkersson@aimo.com",
    "phoneNumber": "+46701234567"
  }
}
```

Response:

```json
{
  "permitId": "permitId-001",
  "productName": "premium",
  "licencePlate": {
    "countryCode": "S",
    "text": "ABC123"
  },
  "fromTime": "2023-05-24T16:37:17Z",
  "toTime": "2023-05-24T16:37:17Z",
  "calculcatedPrice": {
    "currency": "SEK",
    "amount": 200
  }
}
```

# Premits

<h2>Get permit</h2>
<p>To get information about a permit. </p>

> <b>GET /permits/{permit_id}</b>

Response

```json
{
  "permitID": "permitId-001",
  "productID": "product-abc",
  "licencePlate": {
    "countryCode": "FI",
    "text": "XYZ123"
  },
  "fromTime": "2023-05-24T16:37:17Z",
  "toTime": "2023-05-24T16:37:17Z"
}
```

<h2>Update permit</h2>
<p>Updates a booked permit using the given information. </p>

> <b>PATCH /permits/{permit_id}</b>

Parameters

| Name                    | Description                                             | Example                                                                    |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| licensePlate (optional) | contains the license plate object for the parker.       | <pre>{<br> "countryCode": "S" //optional,<br> "text":"ABC123" <br>} </pre> |
| fromTime (optional)     | the new start time of the permit, (has to be after now) | 2023-05-24T16:37:17Z                                                       |
| toTime (optional)       | the new start time of the permit, (has to be after now) | 2023-05-25T16:37:17Z                                                       |

Example Request body:

```json
{
  "licencePlate": {
    "countryCode": "FI",
    "text": "XYZ123"
  },
  "toTime": "2023-05-25T16:37:17Z"
}
```

Response

```json
{
  "permitID": "permitId-001",
  "productID": "product-abc",
  "licencePlate": {
    "countryCode": "FI",
    "text": "XYZ123"
  },
  "fromTime": "2023-05-24T16:37:17Z",
  "toTime": "2023-05-25T16:37:17Z",
  "calculcatedPrice": {
    "currency": "SEK",
    "amount": 300
  }
}
```

<h2>Cancle permit</h2>
<p>To cancel a booked permit. Cancellation is only allowed for permits that haven’t started. </p>

> <b>POST /permits/{permit_id}/cancel</b>

Response

```json
{
  "status": "OK"
}
```
