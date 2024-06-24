document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addAccountBtn').addEventListener('click', showAddAccountForm);
    document.getElementById('listAccountsBtn').addEventListener('click', listAccounts);
    document.getElementById('saveAccountBtn').addEventListener('click', saveAccount);
    document.getElementById('cancelAddBtn').addEventListener('click', showMenu);
    document.getElementById('backToMenuBtn').addEventListener('click', showMenu);
    document.getElementById('cancelEditBtn').addEventListener('click', showMenu);
    document.getElementById('updateAccountBtn').addEventListener('click', updateAccount);
    document.getElementById('searchBar').addEventListener('input', filterAccounts);

    let currentEditAccount = null;
    let allAccounts = []; // Stocker tous les comptes pour la recherche

    function showMenu() {
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('addAccountForm').classList.add('hidden');
        document.getElementById('editAccountForm').classList.add('hidden');
        document.getElementById('accountsList').classList.add('hidden');
    }

    function showAddAccountForm() {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('addAccountForm').classList.remove('hidden');
        document.getElementById('editAccountForm').classList.add('hidden');
        document.getElementById('accountsList').classList.add('hidden');
    }

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

    function listAccounts() {
        fetch('http://localhost:5000/list_accounts')
            .then(response => response.json())
            .then(data => {
                allAccounts = data.accounts; // Stocker tous les comptes pour la recherche
                displayAccounts(data.accounts);
                document.getElementById('menu').classList.add('hidden');
                document.getElementById('addAccountForm').classList.add('hidden');
                document.getElementById('editAccountForm').classList.add('hidden');
                document.getElementById('accountsList').classList.remove('hidden');
            });
    }

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

    function filterAccounts() {
        const searchTerm = document.getElementById('searchBar').value.toLowerCase();
        const filteredAccounts = allAccounts.filter(account => account.toLowerCase().includes(searchTerm));
        displayAccounts(filteredAccounts);
    }

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
