# Mini-Travel-Experience-Listing-PlatformProject Overview

This application is a travel listing platform where users can create, browse, and interact with travel listings. It allows users to register, log in, and log out securely. Once logged in, users can:

View all available travel listings.

View listings specifically created by themselves.

Access a detailed page for each listing to see more information.

Create new listings, edit or delete their existing listings.

Search for listings based on keywords or filters.

Like or save listings to a personal collection for future reference.

Remove listings from their saved collection.

The goal of the application is to provide a smooth and interactive experience for users interested in exploring or sharing travel opportunities.

Tech Stack

Backend: Node.js

Frontend: React

Database: MongoDB

Image Storage: Cloudinary

Explanation of Technologies Used

Node.js was chosen for the backend because it allows for fast, scalable server-side operations and is easy to deploy on platforms like Vercel.

React was used for building the frontend due to its component-based architecture, which enables a dynamic and responsive user interface.

MongoDB was selected as the database because it is lightweight, flexible, and handles JSON-like documents well, making it ideal for storing listings with varying fields.

Cloudinary is used to store and serve images efficiently, ensuring that listing images load quickly and reliably.

Setup Instructions

Initialize the project:

npm init -y

Install required dependencies:

npm install express mongoose bcrypt jsonwebtoken dotenv cors
Running the Project Locally

To run the project locally:

node index.js

Note: The index.js file was removed for deployment on Vercel, so local deployment requires adding this entry point back or adjusting for your deployment environment.

Features Implemented

The application includes the following features:

User Authentication: Users can register, log in, and log out securely.

Listing Management: Users can create, edit, delete, and view listings.

Detail Pages: Each listing has a dedicated page showing full details.

Search Functionality: Users can search through listings based on keywords.

Interaction with Listings: Users can like and save listings to their profile.

Saved Listings Management: Users can view and remove listings from their saved collection.

Optional features include liking and saving listings, which enhance user engagement and personalization.

Architecture & Key Decisions
Technology Stack Choices

Node.js was selected for the backend because it is lightweight, efficient, and deployable on free platforms like Vercel.

MongoDB was chosen for the database because it is scalable, schema-less, and well-suited for handling JSON-like travel listings data.

Authentication

The application uses JWT (JSON Web Tokens) to authenticate users securely.

Passwords are hashed using bcrypt to ensure sensitive data is protected.

An authentication middleware checks the user's login status before allowing access to protected routes such as creating, editing, or deleting listings.

Travel Listings Storage

Listings are stored in MongoDB in a document format like this:

{
  "_id": { "$oid": "69afe3c6f373b422b376165b" },
  "title": "eee",
  "location": "eee",
  "image": "https://res.cloudinary.com/dr8cn77wn/image/upload/v1773134787/zupuyqvxqrf14fl4nemu.jpg",
  "description": "eeeee",
  "price": 333,
  "whoCreated": { "$oid": "69afd14ca5ad23d3e0b2d755" },
  "timePosted": { "$date": "2026-03-10T09:26:30.076Z" },
  "numberOfLikes": 0,
  "__v": 0
}

Each listing stores essential information such as title, location, image URL, description, price, creator ID, timestamp, and the number of likes.

Future Improvements

If more time were available, I would focus on:

Developing a more robust and visually appealing user interface.

Adding advanced filtering and sorting options for listings.

Optimizing performance for a larger dataset.

Scaling Considerations

If the platform were to handle 10,000 or more travel listings, I would implement the following improvements to enhance performance and user experience:

Sharding: Partitioning the MongoDB database across multiple servers to handle large datasets efficiently.

Database Partitioning: Splitting data logically to improve query performance.

Pagination: Limiting the number of listings loaded at once to reduce frontend and backend load.

Enhanced Search Options: Implementing advanced search filters and indexing to allow users to find listings quickly.

publicly accessible api endpoints i created are as follows":
*register
https://mini-travel-experience-listing-plat-omega.vercel.app/api/register

*login
https://mini-travel-experience-listing-plat-omega.vercel.app/api/login

logout
https://mini-travel-experience-listing-plat-omega.vercel.app/api/logout

create listing
https://mini-travel-experience-listing-plat-omega.vercel.app/api/createListing


edit listing
https://mini-travel-experience-listing-plat-omega.vercel.app/api/editListing

delete listing
https://mini-travel-experience-listing-plat-omega.vercel.app/api/deleteListing


search listing
https://mini-travel-experience-listing-plat-omega.vercel.app/api/searchListings?q=beach

like listing
https://mini-travel-experience-listing-plat-omega.vercel.app/api/likeListing


save listing
https://mini-travel-experience-listing-plat-omega.vercel.app/api/manageSavedListings

get listing detail
https://mini-travel-experience-listing-plat-omega.vercel.app/api/getListing?id=69af9e154f0ec874d495cfed

see all saved listings
https://mini-travel-experience-listing-plat-omega.vercel.app/api/manageSavedListings




remove listing from saved array
https://mini-travel-experience-listing-plat-omega.vercel.app/api/manageSavedListings

*list all listings
https://mini-travel-experience-listing-plat-omega.vercel.app/api/listings


list listings created by logged in user
https://mini-travel-experience-listing-plat-omega.vercel.app/api/getListings?mine=true

