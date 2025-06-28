# Save the simplified and reformatted README content into a new text file.
readme_content = """
Social Media Application - Connect App

Table of Contents
1. Introduction
2. Tech Stack
3. Features
4. Quick Start
5. Snippets
6. Links
7. More

Introduction
Explore a user-friendly social media platform with rich features like post creation, exploration, and strong authentication. Enjoy a seamless experience with fast data fetching using React Query.

Tech Stack
- React.js
- Appwrite
- React Query
- TypeScript
- Shadcn
- Tailwind CSS

Features
- Authentication System: Secure and private user authentication.
- Explore Page: Discover posts with a featured creators section.
- Like and Save: Interact with posts through likes and saves.
- Detailed Post Page: View content and related posts.
- Profile Page: Showcase liked posts and edit your profile.
- User Browsing: Explore other users' profiles and posts.
- Create & Edit Posts: Upload and modify posts easily.
- Responsive Design: Optimized for mobile with a bottom navigation bar.
- React Query Integration: Improved performance with data caching and efficient mutations.
- Backend as a Service: Appwrite for authentication, database, and file storage.

Quick Start
Prerequisites
- Git
- Node.js
- npm

Steps
1. Clone the repository:
[   git clone https://github.com/ItsYash1421/ConnectApp.git](https://github.com/aniketsharma04/ConnectApp)
   cd ConnectApp

2. Install dependencies:
   npm install

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   VITE_APPWRITE_URL=
   VITE_APPWRITE_PROJECT_ID=
   VITE_APPWRITE_DATABASE_ID=
   VITE_APPWRITE_STORAGE_ID=
   VITE_APPWRITE_USER_COLLECTION_ID=
   VITE_APPWRITE_POST_COLLECTION_ID=
   VITE_APPWRITE_SAVES_COLLECTION_ID=

   Replace placeholders with your Appwrite credentials.

4. Start the project:
   npm start
   Open http://localhost:3000 in your browser.

Snippets
Find code snippets for key components and styles in the provided `constants`, `globals.css`, `queryKeys`, `tailwind.config.js`, and more.

