# Stock Inventory Application

A full-stack Node.js application to track and display product stock across multiple store locations.

## Features

- 🔍 **Product Search**: Search products by name or SKU
- 📍 **Store Locations**: View all stores where a product is in stock
- 📊 **Inventory Tracking**: Real-time stock quantity display
- 🐳 **Docker Support**: Complete containerization for easy deployment
- 📱 **Responsive UI**: Modern frontend with React

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, Axios, CSS
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Project Structure

```
stock-inventory-app/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── app.js
│   ├── Dockerfile
│   └── package.json
├── frontend/            # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml   # Orchestration
├── .gitignore
└── README.md
```

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/suecodingm/stock-inventory-app.git
cd stock-inventory-app

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:5000
# Database: localhost:5432
```

## Environment Variables

See `.env.example` in each service directory for configuration options.

## API Endpoints

- `GET /api/products/search?query=<name_or_sku>` - Search products
- `GET /api/products/:id/stores` - Get stores with product stock

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
