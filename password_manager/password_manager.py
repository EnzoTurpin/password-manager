from cryptography.fernet import Fernet
import json
import os


# Générer une clé et l'enregistrer
def generate_key():
    key = Fernet.generate_key()
    with open("password_manager/secret.key", "wb") as key_file:
        key_file.write(key)


# Charger la clé
def load_key():
    return open("password_manager/secret.key", "rb").read()


# Chiffrement du texte
def encrypt_text(text, key):
    fernet = Fernet(key)
    return fernet.encrypt(text.encode()).decode()


# Déchiffrement du texte
def decrypt_text(encrypted_text, key):
    fernet = Fernet(key)
    return fernet.decrypt(encrypted_text.encode()).decode()


# Fonction pour ajouter un compte
def add_account(account, email, password, key):
    encrypted_email = encrypt_text(email, key)
    encrypted_password = encrypt_text(password, key)
    if os.path.exists("passwords.json"):
        with open("passwords.json", "r") as file:
            data = json.load(file)
    else:
        data = {}
    data[account] = {"email": encrypted_email, "password": encrypted_password}
    with open("passwords.json", "w") as file:
        json.dump(data, file, indent=4)


# Fonction pour récupérer un compte
def get_account(account, key):
    with open("passwords.json", "r") as file:
        data = json.load(file)
    account_data = data.get(account)
    if account_data:
        email = decrypt_text(account_data["email"], key)
        password = decrypt_text(account_data["password"], key)
        return email, password
    else:
        return None, None


# Fonction pour lister tous les comptes
def list_accounts():
    if os.path.exists("passwords.json"):
        with open("passwords.json", "r") as file:
            data = json.load(file)
            return list(data.keys())
    else:
        return []


# Fonction pour supprimer un compte
def delete_account(account):
    if os.path.exists("passwords.json"):
        with open("passwords.json", "r") as file:
            data = json.load(file)
        if account in data:
            del data[account]
            with open("passwords.json", "w") as file:
                json.dump(data, file, indent=4)
            return True
        else:
            return False
    else:
        return False


# Fonction pour mettre à jour un compte
def update_account(old_account, new_account, email, password, key):
    if os.path.exists("passwords.json"):
        with open("passwords.json", "r") as file:
            data = json.load(file)
        if old_account in data:
            encrypted_email = encrypt_text(email, key)
            encrypted_password = encrypt_text(password, key)
            del data[old_account]
            data[new_account] = {"email": encrypted_email, "password": encrypted_password}
            with open("passwords.json", "w") as file:
                json.dump(data, file, indent=4)
            return True
        else:
            return False
    else:
        return False
