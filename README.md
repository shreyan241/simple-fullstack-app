# Amazon Order Tracker

A full-stack application for tracking and visualizing Amazon order shipments, providing customers with detailed insights into their order history and shipment statuses.

## Features

- **Dashboard** - Visual overview of orders and shipments with key metrics
- **Order Tracking** - Comprehensive tracking information for all shipments
- **Shipment Status** - Real-time status updates with visual indicators
- **Regional Analytics** - Insights into regional fulfillment patterns

## Technical Architecture

The application follows a modern, decoupled architecture that separates the frontend and backend concerns:

```
┌─────────────┐     ┌────────────┐     ┌────────────────┐
│  Next.js    │     │ Django     │     │                │
│  Frontend   │◄───►│ Ninja API  │◄───►│  Database      │
│  (Vercel)   │     │ (Heroku)   │     │  (PostgreSQL)  │
└─────────────┘     └────────────┘     └────────────────┘
       ▲                                        ▲
       │                                        │
       ▼                                        ▼
┌─────────────┐                         ┌──────────────┐
│    Auth0    │                         │ Data Import  │
│    Auth     │                         │ & Processing │
└─────────────┘                         └──────────────┘
```

### Tech Stack

#### Frontend
- **Next.js 14** - React framework with App Router for routing and server components
- **Material UI** - Comprehensive component library for modern UI design
- **Auth0** - Secure authentication and user management
- **TypeScript** - Type-safe JavaScript for improved developer experience
- **SWR** - React Hooks for data fetching and state management

#### Backend
- **Django** - Robust Python web framework for building the server
- **Django Ninja** - Fast API framework inspired by FastAPI with automatic schema validation
- **SQLite** - Lightweight database for development (PostgreSQL in production)
- **Gunicorn** - WSGI HTTP Server for running Python web applications
- **Whitenoise** - Simplified static file serving for Python web apps

## Data Model

The application centers around these key entities:

- **Customer** - User information and order history
- **Order** - Purchase records with status and customer references
- **Shipment** - Tracking details, carrier information, and delivery status
- **Shipment Item** - Products contained within each shipment

## Setup Guide

### Backend Setup

1. **Clone the repository and set up environment**:
   ```bash
   git clone https://github.com/yourusername/amazon-order-tracker.git
   cd amazon-order-tracker/backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure and run the server**:
   ```bash
   python manage.py migrate
   python manage.py loaddata data_dump.json  # Optional: load sample data
   python manage.py runserver
   ```
   The API will be available at http://localhost:8000/api/

### Frontend Setup

1. **Install dependencies and configure environment**:
   ```bash
   cd ../frontend
   npm install
   ```

2. **Create `.env.local` with necessary variables**:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/
   AUTH0_SECRET=your_auth0_secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=your_auth0_domain
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000

## Deployment

### Backend (Heroku)

1. Create a Heroku app and PostgreSQL database
2. Configure environment variables in Heroku dashboard
3. Deploy using Git:
   ```bash
   git push heroku master
   heroku run python manage.py migrate
   heroku run python manage.py loaddata data_dump.json
   ```

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set framework preset to Next.js
3. Configure root directory as "frontend"
4. Add environment variables in Vercel dashboard
5. Deploy the application

## API Overview

The application provides these primary endpoints:

- `/api/customers/{username}/dashboard` - Dashboard statistics
- `/api/customers/{username}/orders` - Customer order list
- `/api/orders/{order_id}` - Detailed order information
- `/api/shipments/{shipment_id}` - Shipment tracking details

Interactive API documentation is available at `/api/docs`.

## Development Workflow

For effective development:

1. Run both frontend and backend servers
2. Make API changes in Django Ninja endpoints
3. Implement UI changes in Next.js components
4. Use the interactive API docs for testing
5. Verify responsive design across devices
