# CK Scheduler

<p align="center">
  <img src="public/img/logo.svg" alt="CK Scheduler" width="120" />
</p>

<h3 align="center">CK Scheduler — Professional Appointment Scheduling</h3>
<p align="center">A full-featured, self-hosted appointment booking system with Stripe payment integration.</p>

---

## Features

- 🗓️ **Multi-step booking wizard** — beautiful public-facing booking experience
- 💳 **Stripe payments** — per-service pricing with Checkout Sessions & webhooks
- 📅 **FullCalendar admin view** — manage all appointments visually
- 👥 **Multi-role auth** — Admin, Provider, Secretary roles
- ⚙️ **Working plans** — per-provider weekly schedules with break times
- 🚫 **Blocked periods** — mark unavailable times per provider
- 📧 **Email notifications** — confirmation, cancellation & reminder emails
- 🔗 **REST API v1** — full CRUD API with API key authentication
- 🔔 **Webhooks** — outbound HTTP triggers on appointment events
- 📊 **Customer management** — full CRM-style customer records
- 🛠️ **Services & categories** — organise services with pricing

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20 + Express 4 |
| Database | MySQL 8 + Knex.js |
| Auth | express-session + bcryptjs |
| Payments | Stripe Node SDK |
| Email | Nodemailer |
| Frontend | Vanilla HTML/CSS/JS |
| Calendar | FullCalendar v6 |
| Templating | EJS |

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- A Stripe account (free test mode works)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/merlinthedev848/ck-scheduler.git
cd ck-scheduler

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your DB credentials, Stripe keys, SMTP settings

# 4. Create database
mysql -u root -p -e "CREATE DATABASE ck_scheduler CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. Run migrations & seed admin user
npm run setup

# 6. Start the server
npm run dev
```

Then open http://localhost:3000

**Default admin login:**
- Email: from your `.env` → `ADMIN_EMAIL`
- Password: from your `.env` → `ADMIN_PASSWORD`

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Copy your **Publishable Key** and **Secret Key** to `.env`
3. Set up a webhook endpoint in Stripe Dashboard:
   - URL: `https://yourdomain.com/payments/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
4. Copy the **Webhook Secret** to `.env`

For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/payments/webhook
```

## REST API

All API endpoints are under `/api/v1/` and require an `X-Api-Key` header.

Generate your API key in **Settings → API**.

| Endpoint | Methods |
|---|---|
| `/api/v1/appointments` | GET, POST, PUT, DELETE |
| `/api/v1/services` | GET, POST, PUT, DELETE |
| `/api/v1/providers` | GET, POST, PUT, DELETE |
| `/api/v1/customers` | GET, POST, PUT, DELETE |

## Environment Variables

See `.env.example` for all available options.

## License

MIT © Chris Kendall
