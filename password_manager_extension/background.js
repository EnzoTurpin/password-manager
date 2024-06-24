chrome.runtime.onInstalled.addListener(function() {
    console.log("Password Manager installed.");
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'formSubmitted') {
        console.log("Form submission detected, creating notification");
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Enregistrer les informations de connexion',
            message: `Voulez-vous enregistrer les informations de connexion pour ${request.url}?`,
            buttons: [
                { title: 'Oui' },
                { title: 'Non' }
            ],
            requireInteraction: true,
            eventTime: Date.now()
        }, function(notificationId) {
            chrome.storage.local.set({ [notificationId]: request }, function() {
                console.log("Notification created and data stored", notificationId);
                sendResponse({status: "notification created"});
            });
        });
        return true; // Indicate that we will respond asynchronously
    }
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    if (buttonIndex === 0) { // 'Oui' button
        chrome.storage.local.get(notificationId, function(data) {
            if (data[notificationId]) {
                var { email, password, url } = data[notificationId];
                fetch(`http://localhost:5000/add_account`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        account: url,
                        email: email,
                        password: password
                    })
                }).then(response => response.json())
                  .then(data => {
                      console.log('Success:', data);
                      chrome.notifications.clear(notificationId);
                  }).catch((error) => {
                      console.error('Error:', error);
                  });
            }
        });
    } else { // 'Non' button
        chrome.notifications.clear(notificationId);
    }
});
