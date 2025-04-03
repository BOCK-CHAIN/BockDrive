# Bock Drive - Cloud Storage Application


Bock Drive is a modern cloud storage solution that provides secure and accessible file storage, similar to Google Drive but with enhanced features and a cleaner interface.

## Features

- **Secure File Storage**: Store your files securely in the cloud
- **User Authentication**: Secure login and signup with email or Google account
- **File Management**: Upload, download, delete, and organize files
- **Folder Support**: Create folders to organize your files
- **Starred Files**: Mark important files with star for quick access
- **Trash Bin**: Deleted files go to trash, which can be restored or permanently deleted
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark modes for comfortable viewing

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **Database**: Firestore
- **Icons**: Lucide React, React Icons
- **Routing**: React Router
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/bock-drive.git
   cd bock-drive
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Project Structure
