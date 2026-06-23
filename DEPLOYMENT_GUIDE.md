# Stock Inventory Application - Deployment Guide

This guide provides step-by-step instructions to deploy the Stock Inventory Application on an AWS EC2 instance or any Linux server.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Prerequisites & Installation](#prerequisites--installation)
3. [Security Group Configuration](#security-group-configuration)
4. [Application Setup](#application-setup)
5. [Deployment](#deployment)
6. [Verification & Testing](#verification--testing)
7. [Troubleshooting](#troubleshooting)
8. [Future IP Changes](#future-ip-changes)

---

## 📦 System Requirements

### Minimum Requirements:
- **OS:** Ubuntu 20.04 LTS or later (or any Linux distribution with apt package manager)
- **CPU:** 2 vCPU minimum
- **RAM:** 2 GB minimum (4 GB recommended)
- **Storage:** 20 GB minimum
- **Internet:** Public IP address with internet access

### Recommended for Production:
- **CPU:** 4 vCPU
- **RAM:** 8 GB
- **Storage:** 50 GB SSD
- **OS:** Ubuntu 22.04 LTS

---

## 🔧 Prerequisites & Installation

### Step 1: Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Step 2: Install Docker

Docker is required to run containerized applications.

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (to run docker without sudo)
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify Docker installation
docker --version
```

**Expected output:** `Docker version XX.XX.XX, build XXXXXXXXX`

### Step 3: Install Docker Compose

Docker Compose orchestrates multi-container applications.

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

**Expected output:** `Docker Compose version XX.XX.XX, build XXXXXXXXX`

### Step 4: Install Git

Git is needed to clone the application repository.

```bash
sudo apt install git -y

# Verify installation
git --version
```

**Expected output:** `git version X.XX.X`

---

## 🔐 Security Group Configuration

### For AWS EC2 Instances:

1. **Go to AWS Console** → EC2 → Security Groups
2. **Select your instance's security group**
3. **Click "Edit inbound rules"** and add these rules:

| Protocol | Port | Source | Description |
|----------|------|--------|-------------|
| TCP | 22 | Your IP or 0.0.0.0/0 | SSH Access |
| TCP | 80 | 0.0.0.0/0 | HTTP (optional) |
| TCP | 443 | 0.0.0.0/0 | HTTPS (optional) |
| TCP | 3000 | 0.0.0.0/0 | Frontend (React) |
| TCP | 5000 | 0.0.0.0/0 | Backend API |
| TCP | 5432 | 0.0.0.0/0 | PostgreSQL (internal only, optional) |

**⚠️ Security Note:** For production, restrict traffic to specific IPs instead of `0.0.0.0/0`.

### For Other Providers or On-Premises:

Open ports **3000**, **5000**, and **5432** in your firewall rules.

---

## 📥 Application Setup

### Step 1: Clone the Repository

```bash
# Navigate to home directory or your preferred location
cd ~

# Clone the repository
git clone https://github.com/suecodingm/stock-inventory-app.git

# Navigate into the project directory
cd stock-inventory-app
```

### Step 2: Get Your Instance's Public IP

```bash
# Get your public IP address
curl http://checkip.amazonaws.com
```

**Note this IP** - you'll need it in the next step (example: `100.58.166.145`)

### Step 3: Create Environment Configuration File

Create a `.env` file in the project root directory with your instance's public IP:

```bash
# Create the .env file
cat > .env << EOF
# Frontend and API URLs - Replace with your instance's public IP
FRONTEND_URL=http://YOUR_PUBLIC_IP:3000
REACT_APP_API_URL=http://YOUR_PUBLIC_IP:5000

# Database Configuration (default values)
DB_USER=stockuser
DB_PASSWORD=stockpass
DB_NAME=stock_inventory

# Optional: Node environment
NODE_ENV=production
EOF
```

**⚠️ Important:** Replace `YOUR_PUBLIC_IP` with your actual instance IP address.

### Example:

If your public IP is `100.58.166.145`, your `.env` file should look like:

```env
FRONTEND_URL=http://100.58.166.145:3000
REACT_APP_API_URL=http://100.58.166.145:5000
DB_USER=stockuser
DB_PASSWORD=stockpass
DB_NAME=stock_inventory
NODE_ENV=production
```

### Step 4: Verify `.env` File

```bash
# View the .env file to confirm it's correct
cat .env
```

### Step 5: Add `.env` to `.gitignore` (Important for Security)

```bash
# Add .env to gitignore so it's not committed to repository
echo ".env" >> .gitignore

# Verify it was added
cat .gitignore | grep ".env"
```

---

## 🚀 Deployment

### Step 1: Navigate to Project Directory

```bash
cd ~/stock-inventory-app
```

### Step 2: Remove Old Containers (First Time Setup)

If this is your first deployment, skip this step. If redeploying, clean up:

```bash
# Stop and remove all containers and volumes
docker-compose down -v
```

### Step 3: Build and Start the Application

```bash
# Build images and start containers in background
docker-compose up --build -d
```

**This will:**
- Build the frontend Docker image
- Build the backend Docker image
- Pull the PostgreSQL Docker image
- Start all three services
- Initialize the database with sample data

### Step 4: Monitor the Build Process

```bash
# View real-time logs
docker-compose logs -f

# Or view logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

**Press `Ctrl + C` to exit logs**

### Step 5: Wait for Full Startup

The application typically takes 30-60 seconds to fully start. You should see messages like:

```
stock_inventory_db | database system is ready to accept connections
stock_inventory_api | Server is running on http://0.0.0.0:5000
stock_inventory_ui | INFO Accepting connections at http://localhost:3000
```

---

## ✅ Verification & Testing

### Step 1: Check Container Status

```bash
# View running containers
docker-compose ps
```

**Expected output:**

```
NAME                  STATUS
stock_inventory_db    Up (healthy)
stock_inventory_api   Up
stock_inventory_ui    Up
```

### Step 2: Check Service Health

```bash
# Test backend API
curl http://YOUR_PUBLIC_IP:5000/health

# Expected: {"status":"OK"}

# Test database connection
docker-compose exec backend npm test
```

### Step 3: Access the Application

Open your browser and navigate to:

```
http://YOUR_PUBLIC_IP:3000
```

Replace `YOUR_PUBLIC_IP` with your actual instance IP (e.g., `http://100.58.166.145:3000`)

### Step 4: Test Search Functionality

1. **Search for a product:**
   - Try searching: `"Laptop Pro 15"`
   - Try searching: `"Wireless Headphones"`
   - Try searching: `"USB-C Cable"`

2. **Expected Results:**
   - Products should display
   - Stores with stock should show
   - Quantities should be visible

3. **Test Sample Data:**

| Product Name | SKU | Expected Stores |
|---|---|---|
| Laptop Pro 15 | LP15-2024 | Downtown, Mall, Airport |
| Wireless Headphones | WH-BT-001 | Downtown, Mall, Suburban |
| USB-C Cable | USB-C-3M | All 4 stores |
| Phone Case | CASE-IP15 | All 4 stores |
| Screen Protector | SCREEN-IP15 | Mall, Airport, Suburban |

---

## 🛠️ Troubleshooting

### Issue: Cannot reach http://YOUR_IP:3000

**Solution:**
1. Verify security group allows port 3000
2. Check if containers are running: `docker-compose ps`
3. Check logs: `docker-compose logs frontend`
4. Verify `.env` file has correct IP

### Issue: "Cannot connect to backend API"

**Solution:**
1. Verify `.env` file has correct IP address
2. Check backend is running: `docker-compose logs backend`
3. Verify security group allows port 5000
4. Check backend CORS logs: `docker-compose logs backend | grep CORS`

### Issue: Database connection error

**Solution:**
1. Check database logs: `docker-compose logs db`
2. Wait 30 seconds for database to fully initialize
3. Restart all services: `docker-compose restart`

### Issue: "Port already in use"

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :5432

# If old containers exist, remove them
docker-compose down -v
```

### Issue: Out of memory

**Solution:**
```bash
# Check Docker disk usage
docker system df

# Clean up unused images and containers
docker system prune -a
```

---

## 📝 Daily Operations

### Starting the Application

```bash
cd ~/stock-inventory-app
docker-compose up -d
```

### Stopping the Application

```bash
cd ~/stock-inventory-app
docker-compose down
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

---

## 🌐 Future IP Changes

If your instance's public IP changes, follow these steps:

### Step 1: Update `.env` File

```bash
# Edit the .env file
nano .env
```

**Update these lines:**
```env
FRONTEND_URL=http://NEW_PUBLIC_IP:3000
REACT_APP_API_URL=http://NEW_PUBLIC_IP:5000
```

Save and exit: `Ctrl + X`, then `Y`, then `Enter`

### Step 2: Restart Services (No rebuild needed!)

```bash
cd ~/stock-inventory-app

# Stop containers
docker-compose down

# Start with new configuration
docker-compose up -d
```

### Step 3: Verify

```bash
# Check status
docker-compose ps

# Access with new IP
curl http://NEW_PUBLIC_IP:5000/health
```

---

## 📊 Backend API Endpoints

Once deployed, you can test these API endpoints:

### Health Check
```bash
curl http://YOUR_PUBLIC_IP:5000/health
```

### Search Products
```bash
curl "http://YOUR_PUBLIC_IP:5000/api/products/search?query=Laptop"
```

### Get All Products
```bash
curl "http://YOUR_PUBLIC_IP:5000/api/products/"
```

### Get Product Stores
```bash
curl "http://YOUR_PUBLIC_IP:5000/api/products/1/stores"
```

---

## 📚 Database Information

### Default Credentials

- **User:** `stockuser`
- **Password:** `stockpass`
- **Database:** `stock_inventory`
- **Port:** `5432`
- **Host:** `db` (within Docker network) or `localhost:5432` (from host)

### Tables

1. **stores** - Store locations
2. **products** - Product catalog
3. **inventory** - Stock levels by product and store

### Sample Data

- **Stores:** 4 (Downtown, Mall, Airport, Suburban)
- **Products:** 5 (Laptop, Headphones, USB Cable, Phone Case, Screen Protector)
- **Inventory Records:** 17 combinations

---

## 🔒 Security Best Practices

1. **Keep `.env` file private** - Never commit it to git
2. **Use strong database passwords** - Change from defaults in production
3. **Restrict security group access** - Don't use `0.0.0.0/0` for sensitive ports
4. **Keep Docker updated** - Regularly update Docker and containers
5. **Use HTTPS in production** - Set up an SSL certificate with a reverse proxy
6. **Regular backups** - Backup PostgreSQL data regularly

---

## 📞 Support & References

- **Docker Documentation:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/

---

## ✨ Summary Checklist

- [ ] System updated (`apt update` & `apt upgrade`)
- [ ] Docker installed and working
- [ ] Docker Compose installed and working
- [ ] Git installed
- [ ] Security groups configured for ports 3000, 5000, 5432
- [ ] Repository cloned
- [ ] `.env` file created with correct IP
- [ ] `.env` added to `.gitignore`
- [ ] Application deployed (`docker-compose up --build`)
- [ ] All containers running (`docker-compose ps`)
- [ ] Frontend accessible at `http://YOUR_IP:3000`
- [ ] Backend API responding at `http://YOUR_IP:5000`
- [ ] Search functionality working

---

**Last Updated:** June 23, 2026
**Version:** 1.0
