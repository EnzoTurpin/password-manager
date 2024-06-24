from flask import Flask, request, jsonify
from password_manager.password_manager import (get_account, add_account, list_accounts, delete_account, update_account, load_key, generate_key)
import os

# Assurez-vous que la clé est générée avant de continuer
if not os.path.exists("password_manager/secret.key"):
    generate_key()  # Génère une clé si elle n'existe pas encore
key = load_key()  # Charge la clé pour le cryptage

app = Flask(__name__)  # Initialise l'application Flask

# Route pour obtenir les informations d'un compte spécifique


@app.route('/get_account', methods=['GET'])
def api_get_account():
    account = request.args.get('account')  # Récupère le nom du compte à partir des paramètres de requête
    email, password = get_account(account, key)  # Obtient l'email et le mot de passe associés au compte
    if email and password:
        return jsonify({"email": email, "password": password})  # Renvoie les informations du compte en JSON
    else:
        return jsonify({"error": "Account not found"}), 404  # Renvoie une erreur si le compte n'est pas trouvé


# Route pour ajouter un nouveau compte
@app.route('/add_account', methods=['POST'])
def api_add_account():
    data = request.json  # Récupère les données JSON de la requête
    account = data.get('account')
    email = data.get('email')
    password = data.get('password')
    add_account(account, email, password, key)  # Ajoute le compte avec les informations fournies
    return jsonify({"status": "success"}), 201  # Renvoie un statut de succès


# Route pour lister tous les comptes
@app.route('/list_accounts', methods=['GET'])
def api_list_accounts():
    accounts = list_accounts()  # Récupère la liste de tous les comptes
    return jsonify({"accounts": accounts})  # Renvoie la liste des comptes en JSON


# Route pour supprimer un compte
@app.route('/delete_account', methods=['POST'])
def api_delete_account():
    data = request.json  # Récupère les données JSON de la requête
    account = data.get('account')
    if delete_account(account):
        return jsonify({"status": "success"})  # Renvoie un statut de succès si le compte a été supprimé
    else:
        return jsonify({"status": "error", "message": "Account not found"}), 404  # Renvoie une erreur si le compte n'est pas trouvé


# Route pour mettre à jour un compte existant
@app.route('/update_account', methods=['POST'])
def api_update_account():
    data = request.json  # Récupère les données JSON de la requête
    old_account = data.get('old_account')
    new_account = data.get('new_account')
    email = data.get('email')
    password = data.get('password')
    if update_account(old_account, new_account, email, password, key):
        return jsonify({"status": "success"})  # Renvoie un statut de succès si le compte a été mis à jour
    else:
        return jsonify({"status": "error", "message": "Account not found"}), 404  # Renvoie une erreur si le compte n'est pas trouvé


# Point d'entrée de l'application
if __name__ == '__main__':
    app.run(port=5000)  # Démarre l'application Flask sur le port 5000
