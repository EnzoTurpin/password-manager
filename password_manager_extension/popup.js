// Ajoute un écouteur d'événement qui se déclenche lorsque le contenu de la page est complètement chargé.
document.addEventListener('DOMContentLoaded', function () {
    // Ajoute des écouteurs d'événements aux différents boutons pour gérer leurs actions respectives.
    document.getElementById('addAccountBtn').addEventListener('click', showAddAccountForm);
    document.getElementById('listAccountsBtn').addEventListener('click', listAccounts);
    document.getElementById('saveAccountBtn').addEventListener('click', saveAccount);
    document.getElementById('cancelAddBtn').addEventListener('click', showMenu);
    document.getElementById('backToMenuBtn').addEventListener('click', showMenu);
    document.getElementById('cancelEditBtn').addEventListener('click', showMenu);
    document.getElementById('updateAccountBtn').addEventListener('click', updateAccount);
    document.getElementById('searchBar').addEventListener('input', filterAccounts);

    // Variables pour stocker l'état actuel de l'édition de compte et la liste de tous les comptes.
    let currentEditAccount = null;
    let allAccounts = [];

    // Fonction pour afficher le menu principal et cacher les autres formulaires.
    function showMenu() {
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('addAccountForm').classList.add('hidden');
        document.getElementById('editAccountForm').classList.add('hidden');
        document.getElementById('accountsList').classList.add('hidden');
    }

    // Fonction pour afficher le formulaire d'ajout de compte et cacher les autres sections.
    function showAddAccountForm() {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('addAccountForm').classList.remove('hidden');
        document.getElementById('editAccountForm').classList.add('hidden');
        document.getElementById('accountsList').classList.add('hidden');
    }

    // Fonction pour afficher le formulaire d'édition de compte avec les informations du compte.
    function showEditAccountForm(account, email, password) {
        currentEditAccount = account;
        document.getElementById('editAccountName').value = account;
        document.getElementById('editAccountEmail').value = email;
        document.getElementById('editAccountPassword').value = password;

        document.getElementById('menu').classList.add('hidden');
        document.getElementById('addAccountForm').classList.add('hidden');
        document.getElementById('editAccountForm').classList.remove('hidden');
        document.getElementById('accountsList').classList.add('hidden');
    }

    // Fonction pour lister tous les comptes en les récupérant depuis le serveur.
    function listAccounts() {
        fetch('http://localhost:5000/list_accounts')
            .then(response => response.json())
            .then(data => {
                allAccounts = data.accounts;
                displayAccounts(data.accounts);
                document.getElementById('menu').classList.add('hidden');
                document.getElementById('addAccountForm').classList.add('hidden');
                document.getElementById('editAccountForm').classList.add('hidden');
                document.getElementById('accountsList').classList.remove('hidden');
            });
    }

    // Fonction pour afficher les comptes dans l'interface utilisateur.
    function displayAccounts(accounts) {
        const accountsContainer = document.getElementById('accounts');
        accountsContainer.innerHTML = '';
        accounts.forEach(account => {
            const accountDiv = document.createElement('div');
            accountDiv.classList.add('account');
            accountDiv.textContent = account;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('account-buttons');

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-button');
            editBtn.textContent = 'M';
            editBtn.addEventListener('click', () => {
                fetch(`http://localhost:5000/get_account?account=${account}`)
                    .then(response => response.json())
                    .then(data => {
                        showEditAccountForm(account, data.email, data.password);
                    });
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-button');
            deleteBtn.textContent = 'S';
            deleteBtn.addEventListener('click', () => deleteAccount(account));

            buttonsDiv.appendChild(editBtn);
            buttonsDiv.appendChild(deleteBtn);
            accountDiv.appendChild(buttonsDiv);
            accountsContainer.appendChild(accountDiv);
        });
    }

    // Fonction pour filtrer les comptes en fonction de la recherche de l'utilisateur.
    function filterAccounts() {
        const searchTerm = document.getElementById('searchBar').value.toLowerCase();
        const filteredAccounts = allAccounts.filter(account => account.toLowerCase().includes(searchTerm));
        displayAccounts(filteredAccounts);
    }

    // Fonction pour enregistrer un nouveau compte en envoyant les données au serveur.
    function saveAccount() {
        const accountName = document.getElementById('accountName').value;
        const accountEmail = document.getElementById('accountEmail').value;
        const accountPassword = document.getElementById('accountPassword').value;

        fetch('http://localhost:5000/add_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account: accountName,
                email: accountEmail,
                password: accountPassword
            })
        }).then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Compte enregistré!');
                    showMenu();
                } else {
                    alert('Erreur lors de l\'enregistrement du compte');
                }
            });
    }

    // Fonction pour mettre à jour un compte existant en envoyant les nouvelles données au serveur.
    function updateAccount() {
        const accountName = document.getElementById('editAccountName').value;
        const accountEmail = document.getElementById('editAccountEmail').value;
        const accountPassword = document.getElementById('editAccountPassword').value;

        fetch('http://localhost:5000/update_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                old_account: currentEditAccount,
                new_account: accountName,
                email: accountEmail,
                password: accountPassword
            })
        }).then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Compte mis à jour!');
                    showMenu();
                } else {
                    alert('Erreur lors de la mise à jour du compte');
                }
            });
    }

    // Fonction pour supprimer un compte en envoyant une requête au serveur.
    function deleteAccount(account) {
        fetch('http://localhost:5000/delete_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account: account })
        }).then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Compte supprimé!');
                    listAccounts();
                } else {
                    alert('Erreur lors de la suppression du compte');
                }
            });
    }
});
