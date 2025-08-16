// happ/static/assets/js/firebase-logic.js

// --- MODAL (POPUP FORM) CONTROLS ---
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// --- MAIN SCRIPT ---
document.addEventListener('DOMContentLoaded', async function() {
    const body = document.querySelector('body');
    const djangoUserId = body.dataset.userId;

    if (!djangoUserId) {
        console.log("No user logged in.");
        document.querySelectorAll('.add-fab').forEach(btn => btn.style.display = 'none');
        return;
    }

    // --- 👇 ADDED: Register the Service Worker 👇 ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/firebase-messaging-sw.js')
        .then(function(registration) {
            console.log('✅ Service Worker registered successfully, scope is:', registration.scope);
        }).catch(function(err) {
            console.error('❌ Service Worker registration failed:', err);
        });
    }

    // --- Setup Firebase Messaging ---
    try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const fcmToken = await messaging.getToken();
        if (fcmToken) {
            const userDocRef = db.collection('users').doc(djangoUserId);
            await userDocRef.set({ fcmToken: fcmToken }, { merge: true });
            console.log('FCM Token saved.');
        }
    } catch (err) {
        console.error('Firebase Messaging Error:', err);
    }
    
    loadDynamicData(djangoUserId);
});


// --- FUNCTION TO ADD A NEW REMINDER ---
// (This function does not need to be changed)
async function addReminder(type) {
    const djangoUserId = document.querySelector('body').dataset.userId;
    if (!djangoUserId) return alert("You must be logged in.");

    let collectionName;
    let modalId;
    let dataToSave = { userId: djangoUserId, createdAt: new Date() };

    try {
        if (type === 'medication') {
            collectionName = 'medicationSchedules';
            modalId = 'medication-modal';
            dataToSave.name = document.getElementById('med-name-input').value;
            dataToSave.dosage = document.getElementById('med-dosage-input').value;
            dataToSave.program = document.getElementById('med-program-input').value;
            dataToSave.quantity = document.getElementById('med-quantity-input').value;
            dataToSave.time = document.getElementById('med-time-input').value;
        } else if (type === 'appointment') {
            collectionName = 'appointmentSchedules';
            modalId = 'appointment-modal';
            dataToSave.doctor = document.getElementById('appt-doctor-input').value;
            dataToSave.location = document.getElementById('appt-location-input').value;
            dataToSave.datetime = document.getElementById('appt-datetime-input').value;
        } else if (type === 'activity') {
            collectionName = 'activitySchedules';
            modalId = 'activity-modal';
            dataToSave.activity = document.getElementById('activity-name-input').value;
            dataToSave.duration = document.getElementById('activity-duration-input').value;
            dataToSave.time = document.getElementById('activity-time-input').value;
        }

        if (Object.values(dataToSave).some(val => val === "")) {
            return alert("Please fill out all fields.");
        }

        await db.collection(collectionName).add(dataToSave);
        alert("Reminder saved successfully!");
        closeModal(modalId);
        document.querySelector(`#${modalId}`).querySelectorAll('input').forEach(input => input.value = '');
    } catch (error) {
        console.error("Error saving reminder:", error);
        alert("There was an error saving your reminder.");
    }
}


// --- FUNCTION TO LOAD AND DISPLAY LISTS ---
// (This function does not need to be changed)
function loadDynamicData(userId) {
    const emptyMessage = '<div class="empty-list-message"><p>Press the + button to add a new item.</p></div>';

    const medContainer = document.getElementById('medication-list-container');
    if (medContainer) {
        db.collection('medicationSchedules').where('userId', '==', userId).orderBy('time').onSnapshot(snapshot => {
            if (snapshot.empty) return medContainer.innerHTML = emptyMessage;
            medContainer.innerHTML = '';
            snapshot.forEach(doc => {
                const s = doc.data();
                medContainer.innerHTML += `
                    <div class="medicine-card">
                        <img src="/static/assets/images/aspirin.png" alt="Medication">
                        <div class="medicine-info">
                            <h2>${s.name}</h2>
                            <p><strong>Time:</strong> ${s.time}</p>
                            <p><strong>Dosage:</strong> ${s.dosage}</p>
                        </div>
                    </div>`;
            });
        });
    }

    const apptContainer = document.getElementById('appointment-list-container');
    if (apptContainer) {
        db.collection('appointmentSchedules').where('userId', '==', userId).orderBy('datetime', 'desc').onSnapshot(snapshot => {
            if (snapshot.empty) return apptContainer.innerHTML = emptyMessage;
            apptContainer.innerHTML = '';
            snapshot.forEach(doc => {
                const s = doc.data();
                const eventDate = new Date(s.datetime);
                apptContainer.innerHTML += `
                    <div class="appointment-card">
                        <div class="appointment-details">
                            <p class="appointment-date">${eventDate.toDateString()}</p>
                            <p class="appointment-time">${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p class="appointment-type">${s.doctor}</p>
                            <p class="appointment-location">${s.location}</p>
                        </div>
                    </div>`;
            });
        });
    }

    const activityContainer = document.getElementById('activity-list-container');
    if (activityContainer) {
        db.collection('activitySchedules').where('userId', '==', userId).orderBy('time').onSnapshot(snapshot => {
            if (snapshot.empty) return activityContainer.innerHTML = emptyMessage;
            activityContainer.innerHTML = '';
            snapshot.forEach(doc => {
                const s = doc.data();
                activityContainer.innerHTML += `
                    <div class="card">
                        <div class="card-content">
                            <h3><span class="bold">${s.activity}</span></h3>
                            <p class="intensity">${s.duration}</p>
                            <p class="time">${s.time}</p>
                        </div>
                    </div>`;
            });
        });
    }
}