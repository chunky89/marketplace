# Marketplace Platform Requirements

## Platform Overview
The platform is a local online marketplace available as a website (with potential future mobile app support), similar to eBay or Vinted, but focused exclusively on same-city transactions with integrated local delivery handled by the platform administrator.

---

## User Access & Accounts

### Requirements
1. Users can browse and search listings without creating an account
2. To post an item for sale or purchase an item, users must create an account
3. User accounts store basic information such as name, phone number, and address (used for delivery)

### Implementation Status
- ✅ Public browse/search without login
- ✅ Account creation required for post/purchase
- ✅ User data stored (name, phone, address, city)

---

## Item Listings

### Requirements
1. Registered users can create listings that include item photos
2. Item title and description
3. Price
4. Location (city-based visibility only)
5. Listings are visible only to users within the same city

### Implementation Status
- ✅ Create listing form (title, description, price, city, photo URL)
- ✅ Photo upload/URL support
- ✅ City-based filtering on listings page
- ✅ Only unsold items displayed to users in same city

---

## Browsing & Search

### Requirements
1. Browse all available items in their city
2. Search for specific items using a search bar
3. View detailed item pages before purchasing

### Implementation Status
- ✅ Browse listings by city
- ✅ Search functionality by title/description
- ✅ Detailed item page with seller info, price, delivery cost
- ✅ Item photos displayed

---

## Purchasing & Payments

### Requirements
1. Users can purchase items directly through the platform
2. Online payment is required to complete a purchase
3. Items are automatically marked as sold after purchase
4. Orders are created and sent to the admin dashboard

### Implementation Status
- ✅ Purchase button on item details page
- ⚠️ Payment processing (marked as "completed" but no actual payment gateway)
- ✅ Items marked as sold after purchase
- ✅ Orders created and stored in localStorage
- ✅ Order details include buyer, seller, item, and payment info

### To-Do
- [ ] Integrate payment gateway (Stripe/PayPal)
- [ ] Add payment validation before order completion

---

## Delivery System

### Requirements
1. Delivery is handled by the platform administrator
2. A fixed £3 delivery fee is applied per order
3. Items must be delivered within 24 hours of purchase

### Implementation Status
- ✅ Fixed £3 delivery fee ($3.00) per order
- ✅ Delivery deadline calculated (7 days from purchase - should be 24 hours)
- ✅ Admin can view delivery status
- ✅ Admin can mark orders as shipped

### To-Do
- [ ] Update delivery deadline from 7 days to 24 hours
- [ ] Add delivery tracking/status updates

---

## Admin Dashboard

### Requirements
The admin dashboard allows full control and monitoring of the marketplace, including:
1. Viewing all orders and purchase details
2. Accessing buyer and seller information (names, phone numbers, addresses)
3. Viewing item details and payment status
4. Managing listings and user activity
5. Tracking delivery status for each order

### Implementation Status
- ✅ Orders tab with complete order details
- ✅ Buyer and seller contact information displayed
- ✅ Item details and payment status visible
- ✅ Listings tab for managing items
- ✅ Users tab for viewing all registered users
- ✅ Mark orders as shipped functionality
- ✅ Delete listings functionality
- ✅ View order status (pending/shipped)

### Features Included
- **Stats Dashboard**: Total Orders, Pending Orders, Total Revenue, Active Listings
- **Tab Navigation**: Orders, Listings, Users
- **Order Management**: View details, mark as shipped
- **Listing Management**: Delete inactive/sold items
- **User Management**: View all user information

---

## Current Features Summary

### Completed ✅
- User registration and login
- Account management with profile data
- Create and manage listings
- Browse listings by city
- Search functionality
- Item detail pages
- Purchase workflow
- Order creation and storage
- Admin dashboard with tabs
- Delivery fee calculation
- City-based marketplace isolation

### In Progress / To-Do ⚠️
- [ ] Real payment gateway integration
- [ ] Update delivery deadline from 7 days to 24 hours
- [ ] Delivery tracking system
- [ ] Email notifications for orders
- [ ] User ratings/reviews
- [ ] Mobile app support (future)
- [ ] Advanced search filters
- [ ] Image upload (currently URL only)

---

## Technical Stack

- **Frontend**: React.js
- **Routing**: React Router v6
- **State Management**: React Context API (Authentication)
- **Storage**: Browser localStorage (local development)
- **Styling**: Custom CSS with Tailwind-like utilities

---

## File Structure

```
src/
├── components/
│   ├── Navbar.js
│   ├── ProtectedRoute.js
│   └── AdminRoute.js
├── context/
│   └── AuthContext.js
├── pages/
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── Listings.js
│   ├── ItemDetails.js
│   ├── CreateListing.js
│   └── Dashboard.js
└── App.js
```

---

## Notes

- All data is currently stored in browser localStorage (suitable for development)
- For production, implement backend API with proper database
- Admin access is role-based via user.role === "admin"
- City matching ensures marketplace isolation by location
