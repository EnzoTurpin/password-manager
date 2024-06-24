// Ajoute un écouteur d'événement qui se déclenche lorsque l'extension est installée.
chrome.runtime.onInstalled.addListener(function() {
    // Affiche un message dans la console indiquant que le gestionnaire de mots de passe est installé.
    console.log("Password Manager installed.");
});

// Ajoute un écouteur d'événement qui se déclenche lorsqu'un message est reçu par le runtime de Chrome.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Vérifie si l'action du message est 'formSubmitted'.
    if (request.action === 'formSubmitted') {
        // Affiche un message dans la console indiquant qu'une soumission de formulaire a été détectée et qu'une notification va être créée.
        console.log("Form submission detected, creating notification");

        // Crée une notification Chrome.
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Enregistrer les informations de connexion',
            message: `Voulez-vous enregistrer les informations de connexion pour ${request.url}?`,
            buttons: [
                { title: 'Oui' }, // Bouton pour accepter
                { title: 'Non' }  // Bouton pour refuser
            ],
            requireInteraction: true, // Nécessite une interaction de l'utilisateur pour disparaître
            eventTime: Date.now() // Heure de l'événement
        }, function(notificationId) {
            // Stocke les informations du formulaire avec l'identifiant de la notification dans le stockage local.
            chrome.storage.local.set({ [notificationId]: request }, function() {
                // Affiche un message dans la console indiquant que la notification a été créée et les données stockées.
                console.log("Notification created and data stored", notificationId);
                // Envoie une réponse pour indiquer que la notification a été créée.
                sendResponse({status: "notification created"});
            });
        });

        // Retourne true pour indiquer que la réponse sera envoyée de façon asynchrone.
        return true;
    }
});

// Ajoute un écouteur d'événement qui se déclenche lorsque l'utilisateur clique sur un bouton de la notification.
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    // Si l'utilisateur clique sur le bouton "Oui".
    if (buttonIndex === 0) {
        // Récupère les informations du formulaire du stockage local.
        chrome.storage.local.get(notificationId, function(data) {
            if (data[notificationId]) {
                // Destructure les informations de l'email, du mot de passe et de l'URL.
                var { email, password, url } = data[notificationId];

                // Envoie une requête POST au serveur local pour ajouter un compte.
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
                })
                .then(response => response.json()) // Traite la réponse en JSON
                .then(data => {
                    // Affiche un message de succès dans la console.
                    console.log('Success:', data);
                    // Supprime la notification.
                    chrome.notifications.clear(notificationId);
                })
                .catch((error) => {
                    // Affiche un message d'erreur dans la console.
                    console.error('Error:', error);
                });
            }
        });
    } else {
        // Si l'utilisateur clique sur le bouton "Non", supprime la notification.
        chrome.notifications.clear(notificationId);
    }
});
