<p align="left">
  <img src="./public/logo.png" width="120" alt="Thirukkural API Logo" />
</p>

# Thirukkural API

A lightning-fast, highly-available REST API to access the timeless wisdom of the Thirukkural.

## Base URL
All API requests are separated into two distinct tiers: **Public** and **Paid**.

### 1. Public API (`/api/public/...`)
Designed for free, unauthenticated access.
- **Rate Limits:** Strictly limited to **30 requests per hour** per IP.
- **Pacing:** A **2-minute mandatory gap** is required between consecutive requests to prevent spam.
- **Authentication:** None required.

### 2. Premium API (`/api/paid/...`)
Designed for unrestricted production access.
- **Rate Limits:** No strict public rate limits applied.
- **Authentication:** A valid API Key is strictly required. If missing, invalid, or expired, it returns `401 Unauthorized`.
- **Passing the Key:** Include your API key in your request header:
  `x-api-key: YOUR_API_KEY`

---

## Interactive Playground

Want to test the endpoints instantly without using curl?
Visit our [Interactive API Playground](http://localhost:3000/docs) to live-test endpoints and grab code snippets in JavaScript, Python, and cURL.

---

## Endpoints

Replace the `<tier>` placeholder with either `public` or `paid`.

### 1. Get Paginated Kurals
Fetch a list of Kurals with pagination support.

**Endpoint:** `GET /api/<tier>/kurals`

**Query Parameters:**
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | `integer` | `1` | The page number to fetch. |
| `limit` | `integer` | `10` | The number of Kurals per page. |

**Example Requests:**
```bash
# Public
curl "http://localhost:3000/api/public/kurals?page=1&limit=5"

# Premium
curl -H "x-api-key: your_api_key_here" "http://localhost:3000/api/paid/kurals?page=1&limit=5"
```

---

### 2. Get a Specific Kural
Fetch a specific Kural by its exact Kural number (1 to 1330).

**Endpoint:** `GET /api/<tier>/kurals/:number`

**Example Requests:**
```bash
# Public
curl "http://localhost:3000/api/public/kurals/1"

# Premium
curl -H "x-api-key: your_api_key_here" "http://localhost:3000/api/paid/kurals/1"
```

---

### 3. Get a Random Kural
Fetch a single, completely random Kural from the database. Perfect for "Quote of the Day" features.

**Endpoint:** `GET /api/<tier>/kurals/random`

**Example Requests:**
```bash
# Public
curl "http://localhost:3000/api/public/kurals/random"

# Premium
curl -H "x-api-key: your_api_key_here" "http://localhost:3000/api/paid/kurals/random"
```

---

## Support & Access
Need a Premium API Key? [Join our Discord Server](https://discord.gg/NebR4K7F) to request an access key!

---

## License
This project is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)**.

You are free to use, modify, and distribute this software. However, if you modify the code and run it as a public network service (like an API), you must make your modified source code available to your users under the same AGPLv3 license.

See the [LICENSE](LICENSE) file for more details.
