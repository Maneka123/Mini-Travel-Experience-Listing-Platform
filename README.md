# Mini-Travel-Experience-Listing-PlatformProject Overview

This application is a travel listing platform where users can create, browse, and interact with travel listings. It allows users to register, log in, and log out securely. I coded the backend first and deployed all apis on vercel.Next i started coding the frontend and tried to deploy it on netlify and vercel.Once logged in, users can:

1]View all available travel listings.

2]View listings specifically created by themselves.

3]Access a detailed page for each listing to see more information.

4]Create new listings, edit or delete their existing listings.

5]Search for listings based on keywords or filters.

6]Like or save listings to a personal collection for future reference.

7]Remove listings from their saved collection.

The goal of the application is to provide a smooth and interactive experience for users interested in exploring or sharing travel opportunities.

Tech Stack

1]Backend: Node.js

2]Frontend: React

3]Database: MongoDB

4]Image Storage: Cloudinary

Explanation of Technologies Used

1]Node.js was chosen for the backend because it allows for fast, scalable server-side operations and is easy to deploy on platforms like Vercel.

2]React was used for building the frontend due to its component-based architecture, which enables a dynamic and responsive user interface.

3]MongoDB was selected as the database because it is lightweight, flexible, and handles JSON-like documents well, making it ideal for storing listings with varying fields.

4]Cloudinary is used to store and serve images efficiently, ensuring that listing images load quickly and reliably.

Setup Instructions

Initialize the project:

1]npm init -y

Install required dependencies:

2npm install express mongoose bcrypt jsonwebtoken dotenv cors
Running the Project Locally

To run the project locally:

1]node index.js

Note: The index.js file was removed for deployment on Vercel, so local deployment requires adding this entry point back or adjusting for your deployment environment.

Features Implemented

The application includes the following features:

1]User Authentication: Users can register, log in, and log out securely.

2]Listing Management: Users can create, edit, delete, and view listings.

3]Detail Pages: Each listing has a dedicated page showing full details.

4Search Functionality: Users can search through listings based on keywords.

5Interaction with Listings: Users can like and save listings to their profile.

6]Saved Listings Management: Users can view and remove listings from their saved collection.

7]Optional features include liking and saving listings, which enhance user engagement and personalization.

Architecture & Key Decisions
Technology Stack Choices

1]Node.js was selected for the backend because it is lightweight, efficient, and deployable on free platforms like Vercel.

2]MongoDB was chosen for the database because it is scalable, schema-less, and well-suited for handling JSON-like travel listings data.

Authentication

1]The application uses JWT (JSON Web Tokens) to authenticate users securely.

2]Passwords are hashed using bcrypt to ensure sensitive data is protected.

3]An authentication middleware checks the user's login status before allowing access to protected routes such as creating, editing, or deleting listings.

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

1]Developing a more robust and visually appealing user interface.

2]Adding advanced filtering and sorting options for listings.

3]Optimizing performance for a larger dataset.

Scaling Considerations

1]If the platform were to handle 10,000 or more travel listings, I would implement the following improvements to enhance performance and user experience:

2]Sharding: Partitioning the MongoDB database across multiple servers to handle large datasets efficiently.

3]Database Partitioning: Splitting data logically to improve query performance.

4]Pagination: Limiting the number of listings loaded at once to reduce frontend and backend load.

5]Enhanced Search Options: Implementing advanced search filters and indexing to allow users to find listings quickly.

001]publicly accessible api endpoints i created are as follows":
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

