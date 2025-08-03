# Firebase Cloud Function Setup for User Deletion

This document explains how to set up a Firebase Cloud Function to securely delete users from your application.

## Why Use Cloud Functions?

The current implementation deletes user data from Firestore but cannot delete the user's Authentication record. Only server-side code (Cloud Functions) can delete Firebase Auth users for security reasons.

## Setup Instructions

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Initialize Cloud Functions

In your project directory:

```bash
firebase login
firebase init functions
```

Choose:
- Use an existing project (select your INR Assistant project)
- JavaScript or TypeScript (recommend TypeScript)
- Install dependencies

### 3. Replace functions/src/index.ts (or index.js)

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const deleteUser = functions.https.onCall(async (data, context) => {
  // Verify the caller is authenticated and is an admin
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to delete users'
    );
  }

  const callerEmail = context.auth.token.email;
  const ADMIN_EMAIL = 'OhaviNiv@gmail.com';
  
  if (callerEmail !== ADMIN_EMAIL) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can delete users'
    );
  }

  const { uid } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'User ID is required'
    );
  }

  try {
    // Delete user data from Firestore
    const batch = admin.firestore().batch();
    
    // Delete from users collection
    const userRef = admin.firestore().collection('users').doc(uid);
    batch.delete(userRef);
    
    // Delete from inrData collection  
    const inrDataRef = admin.firestore().collection('inrData').doc(uid);
    batch.delete(inrDataRef);
    
    await batch.commit();
    
    // Delete the user from Firebase Auth
    await admin.auth().deleteUser(uid);
    
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to delete user'
    );
  }
});
```

### 4. Deploy the Function

```bash
firebase deploy --only functions
```

### 5. Update admin.js to Use the Cloud Function

Replace the current `deleteUser` function with:

```javascript
function deleteUser(userId, userName) {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את המשתמש "${userName}"?\n\nפעולה זו תמחק את כל נתוני המשתמש ולא ניתן לבטלה.`)) {
        return;
    }

    // Show loading state
    const deleteButtons = document.querySelectorAll(`button[onclick*="${userId}"]`);
    deleteButtons.forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'מוחק...';
        btn.className = btn.className.replace('text-red-600', 'text-gray-400');
    });

    // Call the Cloud Function
    const deleteUserFunction = firebase.functions().httpsCallable('deleteUser');
    
    deleteUserFunction({ uid: userId })
        .then((result) => {
            showNotification(`המשתמש "${userName}" נמחק בהצלחה`, 'success');
            initAdminView(); // Refresh the user list
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
            showNotification('שגיאה במחיקת המשתמש: ' + error.message, 'error');
            
            // Restore button state
            deleteButtons.forEach(btn => {
                btn.disabled = false;
                btn.textContent = 'מחק';
                btn.className = btn.className.replace('text-gray-400', 'text-red-600');
            });
        });
}
```

### 6. Add Firebase Functions SDK

Add this script to your HTML files:

```html
<script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-functions.js"></script>
```

## Cost Considerations

- Cloud Functions have a generous free tier
- Each function call costs approximately $0.0000004
- For a small application, costs will be negligible

## Security Benefits

- User deletion requires server-side authentication
- Admin privileges are verified server-side
- Cannot be bypassed by client-side manipulation
- Atomic operations ensure data consistency 