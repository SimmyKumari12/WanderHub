# WanderHub

WanderHub is a full-stack accommodation platform where users can explore stays, view property details, create listings, add reviews, save favorite properties, and manage listings they own.

The application is built using Node.js, Express, MongoDB, and EJS, with authentication, image uploads, category-based browsing, and location-based maps.

## Features

* User registration and login
* Create, edit, and delete accommodation listings
* Browse listings by category
* Categories including:

  * Farms
  * Rooms
  * Mountains
  * Beaches
  * Deserts
  * Cities
  * Islands
  * Camping
* Add and delete reviews
* Rating system for listings
* Save and remove favorite listings
* Owner-based access control for listings
* Image uploads using Cloudinary
* Location-based maps using Leaflet and OpenStreetMap
* Flash messages for success and error notifications
* Responsive interface

## How It Works

### Authentication

Users can register and log in using Passport.js with a local authentication strategy. Sessions are used to maintain the logged-in user's state across requests.

### Listings

Users can browse available accommodations or create their own listings.

Each listing contains information such as:

* Title
* Description
* Price
* Location
* Country
* Category
* Image
* Owner

When a new listing is created, the selected category is stored along with the listing.

### Categories

Listings can be filtered through predefined categories such as Beaches, Mountains, Cities, Camping, and others.

This allows users to browse properties based on the type of destination or stay they are looking for.

### Reviews

Authenticated users can submit reviews and ratings for listings. Reviews are associated with both the listing and the user who created them.

### Favorites

Users can save listings to their favorites using the heart button. Favorite listings are stored and can be accessed through the user's favorites section.

### Maps

The listing location is converted into geographic coordinates using OpenStreetMap's geocoding service. Leaflet is then used to display the location on an interactive map.

### Image Uploads

Listing images are uploaded and managed using Cloudinary instead of storing image files directly on the application server.

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* EJS
* Bootstrap
* Font Awesome
* Leaflet.js

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js
* Express Session

### Services & APIs

* MongoDB Atlas
* Cloudinary
* OpenStreetMap
* Leaflet.js

## Project Structure

```text
WanderHub/
│
├── controllers/       # Application logic
├── models/            # Mongoose models
├── routes/            # Express routes
├── views/             # EJS templates
├── public/             # CSS, JavaScript and static assets
├── init/               # Initial database data
├── utils/              # Utility functions
├── middleware.js       # Custom middleware
├── schema.js           # Validation schemas
├── cloudConfig.js      # Cloudinary configuration
├── app.js              # Main application entry point
├── package.json
└── README.md
```

## Database

WanderHub uses MongoDB Atlas for storing application data.

The main collections include:

* `users`
* `listings`
* `reviews`

Mongoose is used to define schemas and interact with MongoDB.

## Running Locally

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/WanderHub.git
```

Navigate into the project:

```bash
cd WanderHub
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Start the application:

```bash
node app.js
```

The application will run locally on:

```text
http://localhost:8080
```

## Deployment

The application uses MongoDB Atlas as the production database and can be deployed as a Node.js web service.

Environment variables must be configured on the deployment platform rather than committed to the repository.

## Future Improvements

* Search and advanced filtering
* Booking functionality
* Improved recommendation system
* User profile management
* Additional map-based features
* Enhanced mobile responsiveness

## Author

**Simmy Kumari**
B.Tech in Artificial Intelligence & Machine Learning
Indira Gandhi Delhi Technical University for Women
