rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // Allows public read access
      // For more security, you might want to restrict to authenticated users:
      // allow read: if request.auth != null;
    }
  }
} 