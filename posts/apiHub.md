# Aimo API Hub

The Aimo API Hub is the gateway between your company and Aimo’s mobility
services. It enables the creation of applications that can interact with Aimo’s
mobility services, such as parking and in the future EV charging & car sharing.

The hub is divided into modules, where each module serves a specific purpose for
someone with a specific set of needs. In other words, it is a collection of API
endpoints needed to support a user journey.

| Module                  | Purpose                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Visitor parking         | Enables you to offer your customers and/or visitors parking within your own channels, managed by Aimo. |
| Locations (in progress) | Expose our parking zones and connected service offerings to your users.                                |

<h3>Getting started</h3>

To use the Aimo API Hub, the first thing you must do is register with Aimo.
Contact your Aimo representative or the Aimo partner integration team directly
[here](https://aimopark.formstack.com/forms/samarbeta_med_aimo_park)

<h3>Authentication</h3>

All modules requires authentication to interact with. Upon registering, you will
be provisioned with client credentials. These credentials will be used to
authenticate requests you make to the API. It is through this authentication
process that we can:

• Verify that the traffic identifying itself as you is, in fact, you

• Establish your identity to the system

These credentials are unique to each integration on the platform and consists of
a client id and a client secret. When you have these, you can fetch your jwt by
accessing the authentication endpoint:

> <b>POST /auth/token </b>

Request body:

```json
{
  "grantType": "client_credentials",
  "clientId": "1o23nh8th0832lh92d92l3",
  "clientSecret": "oien23ie42n3oi4e2n3oi4en239np2ysusny23nsyu9v3h"
}
```

This will return a Bearer token that can be used to access other endpoints.

The Aimo API Hub utilizes HTTPS to securely transport data across the internet.
Only HTTPS is allowed; it is not possible to access the API using unsecured HTTP
calls.

# Visitor parking module

The visitor parking module lets you resell Aimo's parking services via your own
digital channels and integrated into your customer experience.

As a partner you are able to book permits at Aimo parking locations close to
your business. To activate this module, contact the partner integration team
[here.](https://aimopark.formstack.com/forms/samarbeta_med_aimo_park)

<br/>

<p>The prerequisites before you can start the integration are:

• The Aimo team generating a partner user for you and activating this module

• Configuration of your scope as a reseller; linking the relevant parking zones
and the products you wish to resell

• Signing an agreement to let you act as a reseller.</p>
<br/>

These are some of the core concepts within this module:

• <b>Zone:</b> The Aimo team generating a partner user for you and activating
this module.

• <b>Product:</b> An offer presented to the visitor with an attached price. This
could bundle extra services or present parking in different areas within a zone.

• <b>Price:</b> The price that Aimo will invoice the reseller for the parking
session.

• <b>Permit:</b> The result of a successful booking, which will link the
visitor's car with a time and zone. This is handled in the same manner for
automatic parking facilities as traditional parking attendant facilities.

<br/>

All of the below will be in context of you as a reseller. These are the
endpoints needed to create an integration between your digital system and Aimo.

# Zones

<h3>List zones</h3>

Returns a list of parking zones configured for you as a reseller. Zones contain
metadata such as name and location, which can be used to guide the parker to the
correct location.

> <b>GET /zones</b>

<b>Response:</b>

```json
{
  "zones": [
    { 
      "id":"SE-120",
      "name":"Hötorget",
      "zoneCode": "1234",
      "address": {
        "street": "Sveavägen 17",
        "postCode": "11157",
        "city": "Stockholm",
        "countryCode": "SE",
        "coordinates": {
          "lat": 59.33481,
          "long": 18.06345
        },
        products: [
          {
            "id": "product-1",
            "name": "basic",
          },
          {
            "id": "product-2",
            "name": "premium",
          }
        ],
    },
    { 
      "id":"SE-125",
      "name":"Gallerian"
      /../
    }
  ]
}
```

Response attributes description

| Name     | Description                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id       | Unique identifier for the zone                                                                                                                                           |
| name     | Name of the parking zone                                                                                                                                                 |
| zoneCode | Human readable identifier for the zone so that the parker can verify that they are at the right location. Can be found on signs at the location and also in the Aimo app |
| address  | Address of the zone to help the parker navigate to and from the location                                                                                                 |

<h3>Availability</h3>
<p>To create a good user experience, and not receive errors at booking, you should check availability for the given start and stop time of the parking duration.

This endpoint returns the availability for each specific parking product that is
configured for you as a reseller at the specified zone. You can filter on
product id, unique for each zone, using a query parameter. </p>

> <b>GET
> /zones/{zone_id}/availability?from_time=2023-05-01T10:00:00Z&to_time=2023-05-01T12:00:00Z&product_id=product-123
> </b>

Parameters

| Name                 | Description                        | Example              |
| -------------------- | ---------------------------------- | -------------------- |
| validFrom            | starting time, in ISO 8601 and UTC | 2023-05-01T10:00:00Z |
| validTo              | ending time, in ISO 8601 and UTC   | 2023-05-01T12:00:00Z |
| productID (optional) | a specific productID               | product-123          |

Response

```json
{
  "id": "SE-120",
  "validFrom": "2023-05-01T10:00:00Z",
  "validTo": "2023-05-01T12:00:00Z",
  "products": [
    {
      "id": "product-123",
      "name": "basic",
      "availableSpots": 20,
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 220
      }
    }
  ]
}
```

If there is not a specified product the call and subsequent response would be:

> <b>GET
> /zones/{zone_id}/availability?validFrom=2023-05-01T10:00:00Z&validTo=2023-05-01T12:00:00Z
> </b>

Response

```json
{
  "id": "SE-120",
  "validFrom": "2023-05-01T10:00:00Z",
  "validTo": "2023-05-01T12:00:00Z",
  "products": [
    {
      "id": "product-123",
      "name": "basicflexibleParking",
      "availableSpots": 20,
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 120
      }
    },
    {
      "id": "product-456",
      "name": "premium",
      "availableSpots": 3,
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 240
      }
    },
    {
      "id": "product-789",
      "name": "basic+",
      "availableSpots": 2,
      "calculcatedPrice": {
        "currency": "SEK",
        "amount": 200
      }
    }
  ]
}
```

<h3>Booking</h3>
<p>The actual purchase of a permit for your visitors is done by making a booking. This endpoint is used to create a booking for a given zone and product. The result of a booking is a permit, which gives the parker permission to park at a location and for some duration.</p>

> <b>POST zones/{zone_id}/booking
> </b>

Parameters:

| Name         | Description                                                                                                                                                                                                    | Example                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| productID    | product id                                                                                                                                                                                                     | product-123                                                                |
| licenseplate | contains the license plate object for the parker. Country code is optional. Otherwise follows [International vehicle registration code](https://en.wikipedia.org/wiki/International_vehicle_registration_code) | <pre>{<br> "countryCode": "S" //optional,<br> "text":"ABC123" <br>} </pre> |
| validFrom    | starting time, in ISO 8601 and UTC                                                                                                                                                                             | 2023-05-24T14:37:17Z                                                       |
| validTo      | ending time, in ISO 8601 and UTC                                                                                                                                                                               | 2023-05-24T16:37:17Z                                                       |

Example Request body:

```json
{
  "productId": "product-123",
  "licencePlate": {
    "countryCode": "S",
    "text": "ABC123"
  },
  "validFrom": "2023-05-24T16:37:17Z",
  "validTo": "2023-05-24T16:37:17Z"
}
```

Response:

```json
{
  "permitId": "permitId-001",
  "productID": "product-123",
  "licencePlate": {
    "countryCode": "S",
    "text": "ABC123"
  },
  "validFrom": "2023-05-24T16:37:17Z",
  "validTo": "2023-05-24T16:37:17Z",
  "calculcatedPrice": {
    "currency": "SEK",
    "amount": 200
  }
}
```

# Permits

<h3>Get permit</h3>
<p>To get information about a permit. </p>

> <b>GET /permits/{permit_id}</b>

Response:

```json
{
  "permitID": "permitId-001",
  "productID": "product-123",
  "licencePlate": {
    "countryCode": "S",
    "text": "ABC123"
  },
  "validFrom": "2023-05-24T16:37:17Z",
  "validTo": "2023-05-24T16:37:17Z",
  "permitStatus": "ACTIVE"
}
```

Permit status can be either “ACTIVE” or “CANCELLED”. The latter means that the
permit is no longer valid as the result of a cancel operation (see cancel
endpoint).

<h3>Update permit</h3>
<p>If there is a need to update the permit, for example if the duration needs to be changed, or the license plate needs to be updated, the update endpoint should be used. This endpoint updates a booked permit using the given information.</p>

> <b>PATCH /permits/{permit_id}</b>

Parameters:

| Name                    | Description                                             | Example                                                                    |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| licensePlate (optional) | contains the license plate object for the parker.       | <pre>{<br> "countryCode": "S" //optional,<br> "text":"XYZ123" <br>} </pre> |
| validFrom (optional)    | the new start time of the permit, (has to be after now) | 2023-05-24T16:37:17Z                                                       |
| validTo (optional)      | the new start time of the permit, (has to be after now) | 2023-05-25T16:37:17Z                                                       |

Example Request body:

```json
{
  "licencePlate": {
    "countryCode": "S",
    "text": "XYZ123"
  },
  "validTo": "2023-05-25T16:37:17Z"
}
```

Response

```json
{
  "permitID": "permitId-001",
  "productID": "product123",
  "licencePlate": {
    "countryCode": "S",
    "text": "XYZ123"
  },
  "validFrom": "2023-05-24T16:37:17Z",
  "validTo": "2023-05-25T16:37:17Z",
  "calculcatedPrice": {
    "currency": "SEK",
    "amount": 300
  },
  "permitStatus": "ACTIVE"
}
```

<h2>Cancel permit</h2>
<p>If the parker cancels her visit and the permit is no longer needed it should be marked as cancelled. Cancelled permits are invalid and will not be charged in any invoice. A cancellation is only possible for permits with a validity period that have not started yet. </p>

> <b>POST /permits/{permit_id}/cancel</b>

Response

```json
{
  "id": "649d8673d609e062e68bf893",
  "productID": "831a8ce2-5cc7-46dc-9c67-f1844a080651",
  "licensePlate": {
    "text": "ABC123",
    "countryCode": null
  },
  "validFrom": "2023-07-23T07:21:46Z",
  "validTo": "2023-06-29T13:26:17.513238060Z",
  "calculcatedPrice": {
    "currency": "SEK",
    "amount": 0
  },
  "permitStatus": "CANCELLED"
}
```
