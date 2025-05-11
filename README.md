# Highlevel Scheduler Assignment

- [Highlevel Scheduler Assignment](#highlevel-scheduler-assignment)
  - [Setup Steps](#setup-steps)
  - [API Reference](#api-reference)
    - [`POST /api/events`](#post-apievents)
    - [`GET /api/free-slots`](#get-apifree-slots)
    - [`GET /api/list-events`](#get-apilist-events)
  - [Running Tests](#running-tests)
  - [Improvements that can be made to scale](#improvements-that-can-be-made-to-scale)

## Setup Steps

1. Clone the repository

   ```bash
   git clone https://github.com/cchiragjain/highlevel-scheduler-assignment.git
   ```

2. Inside the folder run

   ```bash
   npm install
   ```

3. Create .env file

   ```txt
   TIMEZONE=US/Eastern
   START_HOUR=8
   END_HOUR=17
   SLOT_DURATION=30
   PORT=7373
   ```

4. Setup a new project at [FireBase](https://www.console.firebase.google.com).

   1. Go in project settings -> service account -> create new private key -> save this key `serviceAccountKey.json` in project root.

5. Now in a terminal run `npm run dev`. Your server should be up and running

## API Reference

### `POST /api/events`

Creates a new event if the time slot is valid and free.

**Body**

```json
{
  "datetime": "2025-05-11T08:30:00",
  "duration": 30
}
```

- `datetime` is interpreted in the eastern/us (default)(can be changed by updating env variable) timezone (`TIMEZONE`)
- `duration` is in minutes(int)

**Responses**

- `200 OK`: Event created
- `400 Bad Request`: Invalid input
- `422 Unprocessable Entity`: Outside working hours/ Already booked slot
- `500 Internal Server Error`

### `GET /api/free-slots`

Returns a list of available time slots for a given date, adjusted to the requested timezone.

**Query Parameters**

- `date` – in `YYYY-MM-DD` format (required)
- `timezone` – any timezone (optional, defaults to value in `TIMEZONE` env)

> Example:
> `GET /api/free-slots?date=2025-05-11&timezone=Asia/Kolkata`

**Response**

```json
{
  "slots": [
    "2025-05-11T17:30:00+05:30",
    "2025-05-11T18:00:00+05:30",
    "2025-05-11T18:30:00+05:30",
    ...
  ],
  "timezone": "Asia/Kolkata"
}
```

- Each time represents the start of a free slot
- Slots are of fixed length (`SLOT_DURATION` minutes, default is 30)
- Returned times are converted to the requested timezone

**Responses**

- `200 OK`: List of available slot start times
- `400 Bad Request`: Invalid `date` format or unknown timezone
- `500 Internal Server Error`: Unexpected error or slot config issue

### `GET /api/list-events`

Returns all events that fall between a given date-time range.
Times are returned in the deafult timezone (`TIMEZONE` from env).

**Query Parameters**

- `startDate` – ISO datetime (requried)
- `endDate` – ISO datetime (requried)

> Example:
> `GET /api/list-events?startDate=2025-05-11T00:00:00&endDate=2025-05-12T00:00:00`

**Response**

```json
[
  {
    "startTime": "2025-05-11T08:30:00-04:00",
    "endTime": "2025-05-11T09:00:00-04:00",
    "duration": 30
  },
  {
    "startTime": "2025-05-11T14:00:00-04:00",
    "endTime": "2025-05-11T14:50:00-04:00",
    "duration": 50
  }
]
```

**Responses**

- `200 OK`: Returns a list of events in the range
- `400 Bad Request`: If input dates are invalid or `startDate >= endDate`
- `500 Internal Server Error`: Unexpected failure while fetching data

## Running Tests

- There are 17(8 from sheet) unit tests defined which can be run using `npm run test`

## Improvements that can be made to scale

- Can dockerise the app to ease in deployments
- Create a logging middleware using something like winston and pass request-id for each request
- For unit tests can mock firestore properly
