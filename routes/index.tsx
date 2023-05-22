import { CSS, render } from "https://deno.land/x/gfm/mod.ts";
import { Head } from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <main
      data-color-mode="auto"
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body"
    >
      <h1 class="text-4xl font-bold text-center">
        API documentation visitor parking v0.1
      </h1>
      <div>
        {APIPage()}
      </div>
    </main>
  );
}
const markdown = `
# Authentication

All calls to the Aimo-API (exept auth/token) requires a jwt to verify your
identity.

First you will need your client credentials, contact the partner integration
team to require these. They are unique to each integrator on the platform. So if
you are an agent, you will need multiple sets of client credentials. These
consists of a client id and a client secret.

When you have these, you can fetch your jwt by accessing the authentication
endpoint

> <b>POST localhost:8000/auth/token </b>

\`\`\`json
{
  "grant_type": "client_credentials",
  "client_id": "1o23nh8th0832lh92d92l3",
  "client_secret": "oien23ie42n3oi4e2n3oi4en239np2ysusny23nsyu9v3h"
}
\`\`\`

This will return a Bearer token that can be used to access other endpoints.

# Zones

This endpoint returns a list of available parking zones available to the user.

> **GET /zones**

Response

\`\`\`json
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
\`\`\`

<h2>Availability</h2>
<p>To check availability at a zone, you should specify the start and stop time of the parking duration.
The endpoint will return the availability for each specific parking product that is available for the user at the specified zone. This productID is unique for each zone.</p>

> <b>GET
> /zones/{zone_id}/availability?productId=pmc-123&from_time=2023-05-01T10:00Z&to_time=2023-05-01T12:00Z
> </b>

Parameters

| Name      | Description                     | Example          |
| --------- | ------------------------------- | ---------------- |
| productID | a specific productID (optional) | pmc-123          |
| fromTime  | starting time, in ISO 8601      | 2023-01-01T0600Z |
| toTime    | ending time, in ISO 8601        | 2023-01-01T0800Z |

Response

\`\`\`json
{
  "id": "SE-120",
  "from_time": "2023-05-01T10:00Z",
  "to_time": "2023-05-01T12:00Z",
  "products": [
    {
      "id": "pmc-123",
      "name": "basic",
      "availability": 20,
      "price": "60kr/h",
      "cost": "120kr"
    }
  ]
}
\`\`\`

If there is not a specified product the call and subsequent response would be:

> <b>GET
> /zones/{zone_id}/availability?to_time=2023-05-01T12:00Z&to_time=2023-05-01T12:00Z
> </b>

Response

\`\`\`json
{
  "id": "SE-120",
  "from_time": "2023-05-01T10:00Z",
  "to_time": "2023-05-01T12:00Z",
  "products": [
    {
      "id": "pmc-123",
      "name": "basicflexibleParking",
      "availability": 20,
      "price": "60kr/h",
      "cost": "120kr"
    },
    {
      "id": "pmc-456",
      "name": "premium",
      "availability": 3,
      "price": "80kr/h",
      "cost": "160kr"
    },
    {
      "id": "pmc-789",
      "name": "evParking",
      "availability": 2,
      "price": "100kr/h",
      "cost": "200kr"
    }
  ]
}
\`\`\`

<h2>Booking</h2>
<p>To complete booking a permit you can use the booking endpoint</p>

> <b>POST zones/{zone_id}/booking
> </b>

Parameters:

| Name         | Description                                    | Example                               |
| ------------ | ---------------------------------------------- | ------------------------------------- |
| productID    | a specific productID                           | pmc-123                               |
| licenseplate | contains the lienceplate object for the parker | {"countryCode": "S", "text":"ABC123"} |
| fromTime     | starting time, in ISO 8601                     | 2023-01-01T0600Z                      |
| toTime       | ending time, in ISO 8601                       | 2023-01-01T0800Z                      |

Example Request body:

\`\`\`json
{
  "productId": "PMC123",
  "licencePlate": {
    "countryCode": "S",
    "licencePlateText": "ABC123"
  },
  "fromTime": "2023-01-01T0600Z",
  "toTime": "2023-01-01T0800Z"
}
\`\`\`

Response:

\`\`\`json
{
  "permitId": "permitId-001",
  "productName": "premium",
  "licencePlate": {
    "countryCode": "S",
    "text": "ABC123"
  },
  "fromDateTime": "2023-01-01T0600Z",
  "toDateTime": "2023-01-01T0800Z",
  "duration": "2h",
  "cost": "120SEK"
}
\`\`\`
`;

const body = render(markdown, {
  baseUrl: "https://example.com",
});

function APIPage() {
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main class="max-w-screen-md px-4 pt-16 mx-auto">
        <div
          dangerouslySetInnerHTML={{ __html: render(body) }}
        />
      </main>
    </>
  );
}
