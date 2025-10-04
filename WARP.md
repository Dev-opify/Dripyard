# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DripYard is a full-stack e-commerce application for a streetwear brand. The project consists of:
- **Frontend**: Vanilla JavaScript, HTML, and CSS multi-page application
- **Backend**: Spring Boot REST API with MySQL database
- **Deployment**: Backend deployed on Railway at https://skillful-nature-production.up.railway.app

## Development Commands

### Frontend
The frontend is a static vanilla JavaScript application:

```bash
# Serve the frontend locally
python -m http.server 8000
# or
npx serve .
# or use VS Code Live Server extension
```

### Backend
The backend is a Spring Boot Maven project in the `backend/` directory:

```bash
# Navigate to backend directory
cd backend

# Build and run locally
./mvnw spring-boot:run
# or
./mvnw clean package -DskipTests
java -jar target/dripyard-backend-0.0.1-SNAPSHOT.jar

# Run tests
./mvnw test

# Clean build
./mvnw clean compile

# Package for deployment
./mvnw clean package
```

### Full Stack Development
```bash
# Terminal 1 - Start backend (runs on port 8080)
cd backend && ./mvnw spring-boot:run

# Terminal 2 - Serve frontend (any port, e.g., 3000)
python -m http.server 3000
# Update api/client.js BASE_HOST to 'localhost:8080' for local development
```

## Architecture

### Page-Based Structure
The project follows a **directory-per-page architecture** where each major feature/page has its own folder containing:
- `index.html` - Page markup
- `styles.css` - Page-specific styles  
- `script.js` - Page functionality and API interactions

### Key Directories

**Customer-Facing Pages:**
- `LandingPage/` - Homepage with hero section, product showcase, and branding
- `categoryPage/` - Product listing with filtering, pagination, and search
- `productDetails/` - Individual product pages with reviews, variants, and cart actions
- `cart/` - Shopping cart management
- `wishlist/` - User wishlist functionality
- `login/` & `signup/` - Authentication with OTP and password options
- `orderCheckout/` - Order creation and address management
- `paymentSuccess/` & `paymentFailure/` - Payment result pages
- `myOrders/` - Order history and tracking
- `userProfile/` - User account settings
- `customerReview/` - Product review submission

**Admin Interface:**
- `Admin_Dashboard/` - Admin overview with stats
- `adminProducts/` - Product management (CRUD)
- `orderManagement/` - Order processing and status updates  
- `couponManagement/` - Discount code management
- `adminReviewCheck/` - Review moderation

**Support:**
- `helpSubmission/` - Customer support ticket system
- `myTickets/` - User support ticket history

### Shared Components

**API Client (`api/client.js`):**
- Centralized HTTP client for backend communication
- JWT token management for authentication
- RESTful API endpoints for products, cart, wishlist, orders, user management, and admin functions
- Base URL configured for `localhost:8080`

**Common Patterns:**
- Each page uses `apiClient` global for backend communication
- Authentication state managed via localStorage tokens
- Consistent error handling with toast notifications
- Responsive design with mobile-first approach

### Data Flow

1. **Authentication:** JWT tokens stored in localStorage, validated on protected routes
2. **Product Display:** API calls to `/api/products` with pagination and filtering
3. **Cart Management:** RESTful operations on `/api/cart/*` endpoints
4. **Order Processing:** Multi-step checkout flow with address and payment handling
5. **Admin Operations:** Separate admin API endpoints under `/api/admin/*`

## Key Features

- **OTP Authentication:** Development mode uses `123456` for testing (MailerSend integration)
- **Image Management:** Product images served from `/api/images/{imageId}` endpoint
- **Responsive Design:** Mobile-friendly layout with CSS Grid and Flexbox
- **Admin Dashboard:** Separate interface for product and order management
- **Review System:** Customer reviews with star ratings
- **Wishlist & Cart:** Full e-commerce cart functionality with quantity controls
- **Order Tracking:** Status updates and order history

## Backend Technology Stack

**Core Technologies:**
- Spring Boot 3.3.1 with Java 17
- Spring Security with JWT authentication
- Spring Data JPA with MySQL database
- Maven for build management
- Lombok for reducing boilerplate code

**Key Dependencies:**
- **Payment Processing**: Razorpay and Stripe integration
- **File Storage**: AWS S3 for image uploads
- **Email Service**: MailerSend integration with Spring Mail
- **Shipping**: Shiprocket API integration
- **API Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Monitoring**: Spring Boot Actuator

## Live API Documentation

**Production API**: https://skillful-nature-production.up.railway.app  
**Swagger UI**: https://skillful-nature-production.up.railway.app/swagger-ui/index.html

### Core API Endpoints

**Authentication:**
- `POST /auth/signup` - User registration with OTP
- `POST /auth/signin` - Login (password or OTP)
- `POST /auth/sent/login-signup-otp` - Send OTP via email

**Products:**
- `GET /api/products` - List products with filters (category, color, size, price range)
- `GET /api/products/{productId}` - Get single product
- `GET /api/products/{productId}/reviews` - Get product reviews
- `POST /api/products/{productId}/reviews` - Create review (auth required)

**Cart Management:**
- `GET /api/cart` - Get user's cart (auth required)
- `PUT /api/cart/add` - Add item to cart (auth required)
- `PUT /api/cart/item/{cartItemId}` - Update cart item (auth required)
- `DELETE /api/cart/item/{cartItemId}` - Remove cart item (auth required)

**Wishlist:**
- `GET /api/wishlist` - Get user's wishlist (auth required)
- `POST /api/wishlist/add-product/{productId}` - Add to wishlist (auth required)
- `DELETE /api/wishlist/{productId}` - Remove from wishlist (auth required)

**Orders:**
- `POST /api/orders/` - Create order with Razorpay payment link (auth required)
- `GET /api/orders/{id}` - Get order details (auth required)
- `GET /api/orders/user` - Get user's order history (auth required)
- `PUT /api/orders/{orderId}/cancel` - Cancel order (auth required)

**User Management:**
- `GET /api/users/profile` - Get user profile (auth required)
- `GET /api/users/transactions` - Get user transactions (auth required)

**Admin Operations:**
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product (admin only)
- `DELETE /api/admin/products/{productId}` - Delete product (admin only)
- `GET /api/admin/orders` - List all orders (admin only)
- `PATCH /api/admin/orders/{orderId}/status` - Update order status (admin only)
- `GET /api/admin/transactions` - Get all transactions (admin only)

**Coupons:**
- `GET /api/coupons/admin/all` - List all coupons
- `POST /api/coupons/admin/create` - Create coupon
- `DELETE /api/coupons/admin/delete/{id}` - Delete coupon
- `POST /api/coupons/apply` - Apply coupon to cart (auth required)

**Images:**
- `GET /api/images/{key}` - Get image by key/ID
- `POST /api/images/upload` - Upload product image

**Support:**
- `POST /helpdesk/submit` - Submit support ticket
- `GET /helpdesk/tickets` - Get all tickets (admin)
- `GET /helpdesk/tickets/{id}` - Get specific ticket

### Authentication
Most endpoints require `Authorization: Bearer <jwt_token>` header. JWT tokens are returned from signin/signup endpoints.

### Database Schema
The backend uses MySQL with JPA entities for:
- `User` (with roles: ADMIN, CUSTOMER, SELLER)
- `Product` (with categories, images, reviews)
- `Cart` and `CartItem`
- `Order` and `OrderItem`
- `Wishlist`
- `Review` and `Rating`
- `Address` and `PaymentDetails`
- `Coupon` and `Transaction`

## Development Notes

### Frontend
- No build process required - direct file serving works
- Pages can be tested independently but require backend API for data
- Update `api/client.js` BASE_HOST for local vs production backend

### Backend
- Runs on port 8080 by default
- MySQL database required (configure in application.properties)
- Environment variables needed for AWS S3, payment gateways, email service
- Admin pages require authentication with ROLE_ADMIN
- OTP development mode uses `123456` when MailerSend domain not verified
