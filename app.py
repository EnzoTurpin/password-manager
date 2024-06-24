from flask import Flask, request, jsonify
from password_manager.password_manager import get_account, add_account, list_accounts, delete_account, update_account, load_key, generate_key
import os

# Assurez-vous que la clé est générée avant de continuer
if not os.path.exists("password_manager/secret.key"):
    generate_key()
key = load_key()

app = Flask(__name__)

@app.route('/get_account', methods=['GET'])
def api_get_account():
    account = request.args.get('account')
    email, password = get_account(account, key)
    if email and password:
        return jsonify({"email": email, "password": password})
    else:
        return jsonify({"error": "Account not found"}), 404

@app.route('/add_account', methods=['POST'])
def api_add_account():
    data = request.json
    account = data.get('account')
    email = data.get('email')
    password = data.get('password')
    add_account(account, email, password, key)
    return jsonify({"status": "success"}), 201

@app.route('/list_accounts', methods=['GET'])
def api_list_accounts():
    accounts = list_accounts()
    return jsonify({"accounts": accounts})

@app.route('/delete_account', methods=['POST'])
def api_delete_account():
    data = request.json
    account = data.get('account')
    if delete_account(account):
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "message": "Account not found"}), 404

@app.route('/update_account', methods=['POST'])
def api_update_account():
    data = request.json
    old_account = data.get('old_account')
    new_account = data.get('new_account')
    email = data.get('email')
    password = data.get('password')
    if update_account(old_account, new_account, email, password, key):
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "message": "Account not found"}), 404

if __name__ == '__main__':
    app.run(port=5000)
