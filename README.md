## AI/LLM Assistance

Throughout the development process LLMs was extensively used only for debugging error and generating example templates. AI was was also used to partially generate readme file which was then reviewed and further enhanced such that every aspect of readme file  provide correct information.


# Handi - MERN Stack Food Ordering System

A comprehensive full-stack food ordering application built with the MERN stack, featuring user authentication, real-time cart management, GPS-based delivery, payment processing, and admin dashboard functionality.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Design Philosophy](#design-philosophy)
- [Installation & Setup](#installation--setup)
- [Application Flow](#application-flow)
- [Authentication System](#authentication-system)
- [Cart & Order Management](#cart--order-management)
- [Admin Panel](#admin-panel)
- [Database Schema](#database-schema)
- [Problems Encountered & Solutions](#problems-encountered--solutions)
- [AI/LLM Assistance](#aillm-assistance)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Overview

Handi Express is a modern food ordering application designed for a Pakistani/Indian takeaway restaurant. The application provides a seamless experience for customers to browse menu items, manage their cart, place orders with GPS-based delivery, and process payments. Administrators can manage menu items, view orders, and update order statuses through a comprehensive dashboard.

### Key Highlights:
- Full-stack MERN application with modern React patterns
- JWT-based authentication with OTP verification via SMS
- Real-time cart management with localStorage persistence
- GPS integration for accurate delivery locations
- Responsive design with square/minimalist aesthetic
- Admin dashboard for complete order and inventory management
- Payment simulation with order tracking

## Technology Stack

### Frontend Technologies
```javascript
// Core Framework
- React 18.x (Functional Components + Hooks)
- React Router DOM (Client-side routing)
- React Bootstrap 5 (UI Components)
- Vite (Build tool & development server)

// State Management
- React Context API (Global state)
- React useReducer (Complex state logic)
- localStorage (Persistent storage)

// Styling
- Bootstrap 5.3.x
- Custom CSS (Square design system)
- Responsive design principles

// HTTP Client
- Axios (API requests with interceptors)

// Development Tools
- ES6+ JavaScript
- JSX syntax
- Modern async/await patterns
```

### Backend Technologies
```javascript
// Core Framework
- Node.js (Runtime environment)
- Express.js (Web framework)
- ES6 Modules (Import/Export syntax)

// Database
- MongoDB (Document database)
- Mongoose (ODM for MongoDB)

// Authentication & Security
- JWT (JSON Web Tokens)
- bcrypt (Password hashing)
- crypto (OTP generation)
- Helmet (Security headers)
- CORS (Cross-origin requests)
- XSS-Clean (XSS protection)
- Express-mongo-sanitize (NoSQL injection prevention)

// External Services
- SMSCHEF (SMS service for OTP)
- OpenStreetMap Nominatim (Reverse geocoding)

// Development Tools
- dotenv (Environment variables)
- cookie-parser (Cookie handling)
- Express rate limiting
```

### Development & Deployment
```bash
# Package Management
- npm (Node package manager)

# Version Control
- Git (Source control)
- GitHub (Repository hosting)

# Environment
- Windows/Linux/macOS compatible
- Node.js 16+ required
```

## Features

### User Authentication
- Multi-step registration process
  - Personal information collection
  - SMS-based OTP verification
  - Secure password hashing with bcrypt + pepper
- JWT token management
  - Secure login with token generation
  - Automatic token refresh
  - Cookie and localStorage integration
- Phone number verification
  - Real SMS delivery via SMSCHEF
  - 6-digit OTP with 5-minute expiry
  - Resend OTP functionality

### Menu Management
- Dynamic item loading from MongoDB
- Real-time inventory updates
- Rich item details (name, description, price, image)
- Category-based organization
- Search and filtering capabilities

### Advanced Cart System
- Context-based state management
  - Global cart state across components
  - Real-time quantity updates
  - Automatic price calculations
- Persistent storage
  - localStorage integration
  - Cart recovery after browser refresh
  - Cross-session persistence
- Smart quantity management
  - Increment/decrement controls
  - Bulk quantity updates
  - Remove item functionality
  - Clear entire cart option

### GPS-Enabled Delivery
- Browser geolocation API integration
- Reverse geocoding using OpenStreetMap Nominatim
- Address auto-population
- Manual address override option
- Delivery vs. collection selection

### Payment Processing
- Multi-step checkout flow
  1. Order details collection
  2. GPS location detection
  3. Payment method selection
  4. Order confirmation
- Payment method options
  - Credit/Debit card simulation
  - Cash on delivery
- Order confirmation system
  - Unique order ID generation
  - Email confirmation (simulated)
  - Estimated delivery time

### Comprehensive Admin Panel
- Secure admin authentication
- Dashboard analytics
  - Total orders overview
  - Revenue tracking
  - Order status distribution
- Order management
  - Real-time order viewing
  - Status updates (new → preparing → ready → delivered)
  - Customer details access
  - Order history tracking
- Inventory management
  - Add new menu items
  - Edit existing items
  - Delete items
  - Upload item images
  - Price and description updates

## Design Philosophy

### Square/Minimalist Aesthetic
The application follows a square design system with the following principles:
- No rounded corners (`border-radius: 0 !important`)
- Clean, sharp edges for modern professional look
- Consistent spacing and typography
- Bootstrap 5 integration with custom overrides
- Responsive design for all devices

### Color Scheme
```css
Primary Colors:
- Navbar: #343a40 (Dark gray)
- Accent: #dc3545 (Red)
- Success: #28a745 (Green)
- Background: #f8f9fa (Light gray)

Text Colors:
- Primary: #333333
- Secondary: #6c757d
- White: #ffffff (for navbar)
```

## Installation & Setup

### Prerequisites
```bash
- Node.js 16+ installed
- MongoDB installed and running
- Git installed
- Modern web browser
```

### Backend Setup
```bash
# 1. Clone the repository
git clone https://github.com/zishankhan-dot/HANDI-MERN.git
cd HANDI-MERN/Backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Configure environment variables
URI=mongodb://127.0.0.1:27017/HANDI
PORT=3000
SMS_API_KEY=your_twilio_api_key
SECRETKEY=your_jwt_secret_key
PEPPER=your_password_pepper
JWT_SECRET=your_admin_jwt_secret

# 5. Start the server
node server.js
```

### Frontend Setup
```bash
# 1. Navigate to frontend directory
cd ../frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Application will be available at:
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
```

## Application Flow

### User Journey
```mermaid
graph TD
    A[Landing Page] --> B[Registration]
    B --> C[OTP Verification]
    C --> D[Login]
    D --> E[Dashboard/Menu]
    E --> F[Add Items to Cart]
    F --> G[View Cart]
    G --> H[Checkout Process]
    H --> I[Order Details]
    I --> J[GPS Location]
    J --> K[Payment]
    K --> L[Order Confirmation]
    L --> M[Redirect to Menu]
```

### Admin Journey
```mermaid
graph TD
    A[Admin Login] --> B[Admin Dashboard]
    B --> C[View Orders]
    B --> D[Manage Items]
    B --> E[Order Status Updates]
    C --> F[Order Details]
    D --> G[Add/Edit/Delete Items]
    E --> H[Update Status]
```

## Authentication System

### JWT Implementation
```javascript
// Token Structure
{
  "userId": "MongoDB ObjectId",
  "Email": "user@example.com",
  "PhoneNumber": "+353-xxx-xxx-xxx",
  "iat": timestamp,
  "exp": timestamp
}

// Token Storage
- localStorage: 'token' (for API requests)
- Cookies: 'authorization' (for server-side validation)
- Headers: 'Authorization: Bearer <token>'
```

### Security Features
- Password hashing with bcrypt + unique pepper
- OTP verification via SMS
- Token expiration (2 hours for users, configurable for admin)
- Secure cookie settings with httpOnly flags
- CORS protection with specific origin allowance
- Input sanitization against NoSQL injection

## Cart & Order Management

### Cart Context Structure
```javascript
const cartContext = {
  cart: {
    items: [
      {
        _id: "item_id",
        name: "Item Name",
        price: 15.99,
        quantity: 2,
        image: "image_url"
      }
    ],
    totalItems: 2,
    totalPrice: 31.98
  },
  // Actions
  addToCart: (item) => {},
  removeFromCart: (itemId) => {},
  updateQuantity: (itemId, quantity) => {},
  clearCart: () => {}
}
```

### Order Processing Flow
1. Cart Validation
   - Check item availability
   - Calculate final totals
   - Apply delivery charges (€3.50)

2. User Authentication Check
   - Verify JWT token
   - Extract user ID for order association
   - Fallback to guest orders if unauthenticated

3. Location Processing
   - Browser geolocation API call
   - Reverse geocoding via Nominatim
   - Address formatting and validation

4. Order Creation
   - Generate unique order ID
   - Store in MongoDB with user association
   - Send confirmation details

## Admin Panel

### Admin Authentication
```javascript
// Admin Credentials (Environment-based)
FIRST_ADMIN_EMAIL=ExampleAdmin@something.com
FIRST_ADMIN_PASSWORD=Admin@123

// Admin JWT Structure
{
  "adminId": "MongoDB ObjectId",
  "email": "admin@example.com",
  "role": "admin",
  "iat": timestamp,
  "exp": timestamp
}
```

### Admin Features
- Order Dashboard
  - Real-time order display
  - Status filtering (new, preparing, ready, delivered)
  - Customer information access
  - Order history and analytics

- Inventory Management
  - CRUD operations for menu items
  - Image upload functionality
  - Price and description updates
  - Category management

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  Name: String,
  Email: String (unique),
  PhoneNumber: String (unique),
  Password: String (hashed),
  isphoneVerified: Boolean,
  Otp: String (hashed, temporary),
  otp_expires: Date,
  createdAt: Date,
  role: String (default: "user")
}
```

### Order Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, optional for guest orders),
  customerName: String,
  phone: String,
  type: String (enum: ['delivery', 'collection']),
  address: String,
  items: [{
    name: String,
    qty: Number,
    price: Number
  }],
  totalPrice: Number,
  paymentMethod: String (enum: ['card', 'cash']),
  status: String (enum: ['new', 'preparing', 'ready', 'delivered', 'cancelled']),
  createdAt: Date
}
```

### Item Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Problems Encountered & Solutions

### 1. JWT Token Inconsistency
Problem: Different JWT payload structures between user registration and login endpoints.
- Registration used `User: userId`
- Login used `userId: userId`
- Order system expected `decoded.userId`

Solution: Standardized all JWT tokens to use `userId` field consistently across all endpoints.

### 2. Environment Variable Mismatch
Problem: Backend used both `SECRETKEY` and `JWT_SECRET` in different files.
- `user.controller.js` used `process.env.SECRETKEY`
- `orderRoute.js` used `process.env.JWT_SECRET`

Solution: Unified all JWT operations to use `process.env.SECRETKEY` consistently.

### 3. Cookie vs Header Authentication
Problem: Frontend sent tokens in Authorization headers, but backend also expected cookie-based tokens.

Solution: Implemented dual token checking:
```javascript
// Check Authorization header first, fallback to cookies
let token = req.header('Authorization')?.replace('Bearer ', '');
if (!token) {
    token = req.cookies?.authorization;
}
```

### 4. Modal Centering Issues
Problem: Bootstrap modal was not perfectly centered on screen despite using `centered` prop.

Solution: Added custom CSS with flexbox centering:
```css
.modal {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
```

### 5. Border-radius Override Conflicts
Problem: Bootstrap's default rounded corners conflicted with desired square design.

Solution: Created global CSS override:
```css
* {
  border-radius: 0 !important;
}
```

### 6. CORS Configuration
Problem: Frontend (port 3001) couldn't communicate with backend (port 3000).

Solution: Configured CORS with specific origin and credentials:
```javascript
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
```

### 7. Cart State Persistence
Problem: Cart data lost on page refresh.

Solution: Implemented localStorage integration with Context API:
```javascript
// Save to localStorage on every cart update
useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);
```

### 8. SMS OTP Integration
Problem: SMSCHEF integration required specific phone number formatting and API configuration.

Solution: Implemented proper phone number validation and SMSCHEF client setup with error handling.

### 9. GPS Location Accuracy
Problem: Browser geolocation API provided coordinates but needed human-readable addresses.

Solution: Integrated OpenStreetMap Nominatim API for reverse geocoding:
```javascript
const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
);
```

### 10. Route Import Error
Problem: Vite development server failed due to missing `RouteTest` component import.

Solution: Removed non-existent import and cleaned up route configuration.

## AI/LLM Assistance

Throughout the development process LLMs was extensively used only for debugging error and generating example templates. AI was was also used to partially generate readme file which was then reviewed and further enhanced such that every aspect of readme file  provide correct information.


## Project Structure

```
HANDI-MERN/
├── Backend/
│   ├── data/
│   │   ├── admin.seed.js          # Admin user seeding
│   │   └── items.data.js          # Sample menu items
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification
│   │   ├── order.controller.js    # Order logic (deprecated)
│   │   ├── sms.js                 # SMSCHEF SMS service
│   │   └── user.controller.js     # User authentication
│   ├── models/
│   │   ├── items.model.js         # Menu item schema
│   │   ├── order.model.js         # Order schema
│   │   └── user.models.js         # User schema
│   ├── routes/
│   │   ├── adminRoute.js          # Admin API endpoints
│   │   ├── itemRoute.js           # Menu item endpoints
│   │   ├── orderRoute.js          # Order management
│   │   └── userRoute.js           # User authentication
│   ├── .env                       # Environment variables
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Express server setup
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.instance.js  # API client configuration
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx # Admin main dashboard
│   │   │   ├── AdminLogin.jsx     # Admin authentication
│   │   │   ├── AdminManager.jsx   # Admin management
│   │   │   ├── ItemManager.jsx    # Menu item management
│   │   │   ├── Navigation.jsx     # Main navigation
│   │   │   ├── orderform.jsx      # Order form component
│   │   │   └── OrderManager.jsx   # Order management
│   │   ├── context/
│   │   │   └── CartContext.jsx    # Global cart state
│   │   ├── pages/
│   │   │   ├── AdminPanel.jsx     # Admin panel page
│   │   │   ├── Cart.jsx           # Cart and checkout
│   │   │   ├── dashboard.jsx      # Main menu page
│   │   │   └── register_login.jsx # User authentication
│   │   ├── App.jsx                # Main app component
│   │   ├── global-square.css      # Global styling
│   │   └── index.jsx              # React entry point
│   ├── package.json               # Frontend dependencies
│   └── vite.config.js             # Vite configuration
└── README.md                      # This file
```

## Deployment

### Frontend Deployment Options

#### Option 1: Vercel Deployment (Recommended)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend directory
cd frontend

# 3. Build the project
npm run build

# 4. Deploy to Vercel
vercel

# 5. Follow prompts and configure:
# - Set build command: npm run build
# - Set output directory: dist
# - Set environment variables in Vercel dashboard
```

**Environment Variables for Vercel:**
- `VITE_API_BASE_URL`: Your backend API URL (e.g., https://your-backend.herokuapp.com)

#### Option 2: Netlify Deployment
```bash
# 1. Build the project
cd frontend
npm run build

# 2. Deploy to Netlify
# - Drag and drop 'dist' folder to Netlify dashboard
# - Or connect GitHub repository

# 3. Configure build settings:
# - Build command: npm run build
# - Publish directory: dist
# - Node version: 18
```

#### Option 3: GitHub Pages (Static Hosting)
```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json scripts:
"homepage": "https://yourusername.github.io/HANDI-MERN",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# 3. Deploy
npm run deploy
```

### Backend Deployment Options

#### Option 1: Heroku Deployment (Recommended)
```bash
# 1. Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Navigate to backend directory
cd Backend

# 4. Create Heroku app
heroku create your-app-name

# 5. Set environment variables
heroku config:set URI=mongodb+srv://username:password@cluster.mongodb.net/handi
heroku config:set PORT=3000
heroku config:set SMS_API_KEY=your_sms_api_key
heroku config:set SECRETKEY=your_jwt_secret
heroku config:set PEPPER=your_password_pepper
heroku config:set JWT_SECRET=your_admin_jwt_secret
heroku config:set NODE_ENV=production

# 6. Create Procfile in Backend directory
echo "web: node server.js" > Procfile

# 7. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Option 2: Railway Deployment
```bash
# 1. Connect GitHub repository to Railway
# Visit https://railway.app and connect your GitHub

# 2. Select Backend folder as root
# 3. Set environment variables in Railway dashboard:
URI=mongodb+srv://username:password@cluster.mongodb.net/handi
PORT=3000
SMS_API_KEY=your_sms_api_key
SECRETKEY=your_jwt_secret
PEPPER=your_password_pepper
JWT_SECRET=your_admin_jwt_secret
NODE_ENV=production

# 4. Railway will auto-deploy on git push
```

#### Option 3: DigitalOcean App Platform
```bash
# 1. Create account on DigitalOcean
# 2. Create new App from GitHub repository
# 3. Configure app settings:
#    - Source: Backend folder
#    - Build command: npm install
#    - Run command: node server.js
#    - Port: 3000

# 4. Set environment variables in DigitalOcean dashboard
```

#### Option 4: Azure Virtual Machine (Full Control)
```bash
# 1. Create Azure VM with Ubuntu 20.04 LTS
# VM Size: Standard B2s (2 vcpus, 4 GiB memory) - Suitable for small applications
# VM Size: Standard B4ms (4 vcpus, 16 GiB memory) - Recommended for production

# 2. Connect to VM via SSH
ssh azureuser@your-vm-ip-address

# 3. Update system packages
sudo apt update && sudo apt upgrade -y

# 4. Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 5. Install MongoDB Community Edition
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 6. Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 7. Configure MongoDB for remote access (optional)
sudo nano /etc/mongod.conf
# Change bindIp from 127.0.0.1 to 0.0.0.0 for remote access
# bindIp: 0.0.0.0

# 8. Restart MongoDB
sudo systemctl restart mongod

# 9. Install PM2 for process management
sudo npm install -g pm2

# 10. Clone your repository
git clone https://github.com/zishankhan-dot/HANDI-MERN.git
cd HANDI-MERN

# 11. Setup Backend
cd Backend
npm install

# 12. Create production environment file
cat > .env << EOF
NODE_ENV=production
URI=mongodb://localhost:27017/handi
PORT=3000
SMS_API_KEY=your_sms_api_key
SECRETKEY=your_jwt_secret
PEPPER=your_password_pepper
JWT_SECRET=your_admin_jwt_secret
EOF

# 13. Start backend with PM2
pm2 start server.js --name "handi-backend"
pm2 startup
pm2 save

# 14. Setup Frontend
cd ../frontend
npm install
npm run build

# 15. Install and configure Nginx
sudo apt install nginx -y

# 16. Create Nginx configuration
sudo nano /etc/nginx/sites-available/handi
```

**Nginx Configuration for Azure VM:**
```nginx
server {
    listen 80;
    server_name your-domain.com your-vm-ip-address;

    # Frontend (React build)
    location / {
        root /home/azureuser/HANDI-MERN/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 17. Enable Nginx site
sudo ln -s /etc/nginx/sites-available/handi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 18. Configure Azure Network Security Group
# Allow inbound traffic on ports:
# - Port 22 (SSH)
# - Port 80 (HTTP)
# - Port 443 (HTTPS)
# - Port 3000 (Node.js - optional, for direct API access)

# 19. Optional: Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com

# 20. Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

**Azure VM Specifications Recommendations:**

| Application Size | VM Size | vCPUs | RAM | Storage | Estimated Cost/Month |
|-----------------|---------|-------|-----|---------|---------------------|
| Development | Standard B1s | 1 | 1 GB | 30 GB | ~$7.59 |
| Small Production | Standard B2s | 2 | 4 GB | 30 GB | ~$30.37 |
| Medium Production | Standard B4ms | 4 | 16 GB | 32 GB | ~$121.47 |
| Large Production | Standard D4s v3 | 4 | 16 GB | 32 GB | ~$140.16 |

**MongoDB Security Configuration for Azure VM:**
```bash
# 1. Create MongoDB admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "your_secure_password",
  roles: ["root"]
})
exit

# 2. Enable authentication in MongoDB
sudo nano /etc/mongod.conf
# Add these lines:
security:
  authorization: enabled

# 3. Restart MongoDB
sudo systemctl restart mongod

# 4. Update connection string in .env
URI=mongodb://admin:your_secure_password@localhost:27017/handi?authSource=admin

# 5. Create application database and user
mongo -u admin -p your_secure_password --authenticationDatabase admin
use handi
db.createUser({
  user: "handiapp",
  pwd: "app_secure_password",
  roles: ["readWrite"]
})
exit

# 6. Update connection string for application user
URI=mongodb://handiapp:app_secure_password@localhost:27017/handi
```

### Database Deployment

#### MongoDB Atlas (Cloud Database - Recommended)
```bash
# 1. Create MongoDB Atlas account
# Visit https://www.mongodb.com/cloud/atlas

# 2. Create new cluster
# Choose free tier (M0 Sandbox)

# 3. Create database user
# Database Access → Add New Database User

# 4. Whitelist IP addresses
# Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

# 5. Get connection string
# Clusters → Connect → Connect your application
# Copy connection string and update URI in environment variables
```

#### Azure Cosmos DB (MongoDB API)
```bash
# 1. Create Azure Cosmos DB account
# Visit Azure Portal → Create Resource → Azure Cosmos DB

# 2. Choose API: Azure Cosmos DB for MongoDB

# 3. Configure account settings:
# - Account Name: handi-cosmosdb
# - API: Azure Cosmos DB for MongoDB
# - Location: Same as your VM region
# - Capacity mode: Provisioned throughput (400 RU/s minimum)

# 4. Get connection string from Azure Portal
# Settings → Connection String → Primary Connection String

# 5. Update environment variables:
URI=mongodb://handi-cosmosdb:your-primary-key@handi-cosmosdb.mongo.cosmos.azure.com:10255/handi?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@handi-cosmosdb@
```

#### Self-Hosted MongoDB on Azure VM (Included in VM setup above)
```bash
# Already covered in Azure VM deployment section
# Benefits:
# - Full control over MongoDB configuration
# - No additional database costs
# - Direct network connection (faster)
# - Custom backup and maintenance schedules

# Considerations:
# - Requires manual database administration
# - You handle backups and security
# - Need to monitor database performance
```

### Azure-Specific Configuration

#### Azure Application Gateway (Load Balancer + SSL)
```bash
# 1. Create Application Gateway in Azure Portal
# 2. Configure backend pool with your VM
# 3. Set up SSL certificate
# 4. Create routing rules for frontend and API

# Benefits:
# - SSL termination
# - Load balancing for multiple VMs
# - Web Application Firewall (WAF)
# - Auto-scaling capabilities
```

#### Azure Key Vault (Secure Environment Variables)
```bash
# 1. Create Azure Key Vault
az keyvault create --name handi-keyvault --resource-group your-resource-group --location eastus

# 2. Store secrets
az keyvault secret set --vault-name handi-keyvault --name "JWT-SECRET" --value "your-jwt-secret"
az keyvault secret set --vault-name handi-keyvault --name "SMS-API-KEY" --value "your-sms-key"
az keyvault secret set --vault-name handi-keyvault --name "MONGODB-URI" --value "your-mongodb-connection"

# 3. Grant VM access to Key Vault
# Enable System Managed Identity on VM
# Grant VM identity access to Key Vault secrets

# 4. Update application to fetch secrets from Key Vault
# Install Azure SDK: npm install @azure/keyvault-secrets @azure/identity
```

**Environment Variables Fetching from Azure Key Vault:**
```javascript
// keyVaultConfig.js
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const credential = new DefaultAzureCredential();
const vaultName = 'handi-keyvault';
const url = `https://${vaultName}.vault.azure.net`;

const client = new SecretClient(url, credential);

async function getSecret(secretName) {
  try {
    const secret = await client.getSecret(secretName);
    return secret.value;
  } catch (error) {
    console.error(`Error fetching secret ${secretName}:`, error);
    return null;
  }
}

module.exports = { getSecret };
```

#### Azure Backup for VM and Database
```bash
# 1. Enable Azure Backup for VM
# Azure Portal → VM → Backup → Enable backup

# 2. Configure automated MongoDB backups
# Create backup script on VM:
cat > /home/azureuser/mongodb-backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/azureuser/backups"
mkdir -p $BACKUP_DIR

# Create MongoDB dump
mongodump --host localhost --port 27017 -u handiapp -p app_secure_password --db handi --out $BACKUP_DIR/mongodb_backup_$DATE

# Compress backup
tar -czf $BACKUP_DIR/mongodb_backup_$DATE.tar.gz -C $BACKUP_DIR mongodb_backup_$DATE
rm -rf $BACKUP_DIR/mongodb_backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongodb_backup_*.tar.gz" -mtime +7 -delete

# Upload to Azure Blob Storage (optional)
# az storage blob upload --account-name yourstorageaccount --container-name backups --name mongodb_backup_$DATE.tar.gz --file $BACKUP_DIR/mongodb_backup_$DATE.tar.gz
EOF

chmod +x /home/azureuser/mongodb-backup.sh

# 3. Schedule daily backups with cron
crontab -e
# Add line: 0 2 * * * /home/azureuser/mongodb-backup.sh
```

### Full Deployment Workflow

#### Step 1: Prepare Repository
```bash
# 1. Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Update frontend API URL
# In frontend/src/api/axios.instance.js
# Change baseURL to your deployed backend URL
```

#### Step 2: Deploy Backend First
```bash
# 1. Deploy backend to Heroku/Railway
# 2. Note the deployed backend URL
# 3. Test API endpoints: https://your-backend-url.herokuapp.com/api/items
```

#### Step 3: Deploy Frontend
```bash
# 1. Update VITE_API_BASE_URL in frontend
# 2. Deploy to Vercel/Netlify
# 3. Test complete application flow
```

### Environment Variables Summary

#### Backend (.env)
```bash
NODE_ENV=production
URI=mongodb+srv://username:password@cluster.mongodb.net/handi
PORT=3000
SMS_API_KEY=your_sms_api_key
SECRETKEY=your_secure_jwt_secret_key
PEPPER=your_secure_password_pepper
JWT_SECRET=your_admin_jwt_secret
```

#### Frontend (Vercel/Netlify)
```bash
VITE_API_BASE_URL=https://your-backend-url.herokuapp.com
```

### Post-Deployment Checklist

- [ ] Backend API responds correctly
- [ ] Database connection established
- [ ] Frontend loads and displays menu items
- [ ] User registration and login work
- [ ] Cart functionality operates
- [ ] Order placement successful
- [ ] Admin panel accessible
- [ ] SMS OTP service functioning
- [ ] GPS location detection works

### Troubleshooting Common Issues

#### CORS Errors
```javascript
// In server.js, update CORS configuration
app.use(cors({
    origin: ['http://localhost:3001', 'https://your-frontend-url.vercel.app'],
    credentials: true
}));
```

#### Build Failures
```bash
# Ensure Node.js version compatibility
# Add to package.json
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

#### Database Connection Issues
```bash
# Verify MongoDB Atlas IP whitelist
# Check connection string format
# Ensure database user has proper permissions
```

### Production Optimizations

#### Backend Optimizations
```javascript
// Add to server.js
const compression = require('compression');
const helmet = require('helmet');

app.use(compression());
app.use(helmet());

// Set proper cache headers
app.use(express.static('public', {
  maxAge: '1d'
}));
```

#### Frontend Optimizations
```bash
# Enable production builds
npm run build

# Verify bundle size
npm install -g bundlizer
bundlizer dist/assets/*.js
```

### Monitoring and Maintenance

#### Heroku Logs
```bash
# View application logs
heroku logs --tail

# Monitor dyno status
heroku ps
```

#### Performance Monitoring
- Set up application monitoring (New Relic, DataDog)
- Configure error tracking (Sentry)
- Monitor database performance (MongoDB Atlas monitoring)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request


---

Developed on MERN Stack 
