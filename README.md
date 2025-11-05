<p align="center">
  <img src="./assets/airbnc_banner_be.png" alt="airbnc banner" width="1000"/>
</p>

AirBnC is the back end API of a full stack property booking application, connected to a React front end interface: [pt-fe-airbnc](https://github.com/rebeccajopling/pt-fe-airbnc)

It is built with Node.js, Express, and PostgreSQL, and supports features like property listings, property reviews, and user accounts. The database is hosted on Supabase and deployed on Render.
<br>

### Live API

---

🔗 [AirBnC Available Endpoints](https://airbnc-ez73.onrender.com/)
<br>

### Getting Started

---

#### 1. Install Dependencies

Install all project dependencies:

```
npm install
```

#### 2. Create the Database

Create the test and development local databases:

```
npm run setup-dbs
```

#### 3. Set Up Environment Variables

Create two .env files, `.env.test` and `.env.dev`, to store database credentials.

Add to `.env.test`:

```
PGDATABASE=airbnc_test
```

Add to `.env.dev`:

```
PGDATABASE=airbnc
```

Add `.env*` to `.gitignore`.

#### 4. Seed the Database

Seed the development database:

```
npm run seed
```

The test database seeds automatically.

#### 5. Start the Server

Start the local server:

```
npm run dev
```

Open `localhost:9090` in your browser or an API client (e.g., Postman) to explore different endpoints.

#### 6. Run Tests

Ensure all tests pass successfully:

```
npm test
```
