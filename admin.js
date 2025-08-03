const ADMIN_EMAIL = "OhaviNiv@gmail.com";

// Check if the current user is an admin
function checkAdminStatus(user) {
    if (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        document.getElementById('adminName').textContent = `מנהל: ${user.displayName}`;
        initAdminView();
    } else {
        alert("אין לך הרשאות גישה לדף זה.");
        window.location.href = 'index.html';
    }
}

// Initialize admin view
function initAdminView() {
    const db = firebase.firestore();
    const userList = document.getElementById('user-list');
    const userCards = document.getElementById('user-cards');
    
    // Show loading indicator
    userList.innerHTML = '<tr><td colspan="4" class="text-center py-8"><div class="flex items-center justify-center gap-2"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div><span class="text-gray-600">טוען רשימת משתמשים...</span></div></td></tr>';
    userCards.innerHTML = '<div class="flex items-center justify-center py-8"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div><span class="text-gray-600 mr-3">טוען רשימת משתמשים...</span></div>';

    db.collection("users").orderBy("createdAt", "desc").get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            userList.innerHTML = '<tr><td colspan="4" class="text-center py-4">לא נמצאו משתמשים.</td></tr>';
            userCards.innerHTML = '<div class="text-center py-4 text-gray-500">לא נמצאו משתמשים.</div>';
            return;
        }
        
        let usersHtml = '';
        let cardsHtml = '';
        
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const registrationDate = user.createdAt ? user.createdAt.toDate().toLocaleDateString('he-IL') : 'לא זמין';
            
            // Table row for desktop
            usersHtml += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-4 py-3">${user.displayName || 'לא זמין'}</td>
                    <td class="px-4 py-3">${user.email}</td>
                    <td class="px-4 py-3">${registrationDate}</td>
                    <td class="px-4 py-3">
                        <button class="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50" onclick="deleteUser('${doc.id}', '${user.displayName || user.email}')">מחק</button>
                    </td>
                </tr>
            `;
            
            // Card for mobile
            cardsHtml += `
                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-semibold text-gray-900">${user.displayName || 'לא זמין'}</h3>
                            <p class="text-sm text-gray-600">${user.email}</p>
                        </div>
                        <button class="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 text-sm" onclick="deleteUser('${doc.id}', '${user.displayName || user.email}')">
                            מחק
                        </button>
                    </div>
                    <div class="text-xs text-gray-500">
                        <span class="font-medium">תאריך הרשמה:</span> ${registrationDate}
                    </div>
                </div>
            `;
        });
        
        userList.innerHTML = usersHtml;
        userCards.innerHTML = cardsHtml;
    }).catch(error => {
        console.error("Error fetching users:", error);
        userList.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-red-500">שגיאה בטעינת המשתמשים.</td></tr>';
        userCards.innerHTML = '<div class="text-center py-4 text-red-500">שגיאה בטעינת המשתמשים.</div>';
    });
}

// This function handles user deletion
// In a production environment, this should call a Firebase Cloud Function
// For now, it will delete the user's data from Firestore collections
function deleteUser(userId, userName) {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את המשתמש "${userName}"?\n\nפעולה זו תמחק את כל נתוני המשתמש ולא ניתן לבטלה.`)) {
        return;
    }

    const db = firebase.firestore();
    
    // Show loading state
    const deleteButtons = document.querySelectorAll(`button[onclick*="${userId}"]`);
    deleteButtons.forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'מוחק...';
        btn.className = btn.className.replace('text-red-600', 'text-gray-400');
    });

    // Delete user data from all collections
    const batch = db.batch();
    
    // Delete from users collection
    const userRef = db.collection('users').doc(userId);
    batch.delete(userRef);
    
    // Delete from inrData collection
    const inrDataRef = db.collection('inrData').doc(userId);
    batch.delete(inrDataRef);
    
    batch.commit().then(() => {
        showNotification(`המשתמש "${userName}" נמחק בהצלחה`, 'success');
        // Refresh the user list
        initAdminView();
    }).catch(error => {
        console.error("Error deleting user data:", error);
        showNotification('שגיאה במחיקת נתוני המשתמש', 'error');
        
        // Restore button state
        deleteButtons.forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'מחק';
            btn.className = btn.className.replace('text-gray-400', 'text-red-600');
        });
    });
}

// Show notification function (add this if it doesn't exist)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
