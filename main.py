from password_manager.password_manager import *
from app import app
import os

# Assurez-vous que la clé est générée avant de continuer
if not os.path.exists("password_manager/secret.key"):
    generate_key()
key = load_key()

def manage_passwords():
    while True:
        print("\nGestion des mots de passe:")
        print("1. Ajouter un compte")
        print("2. Récupérer un compte")
        print("3. Lister les comptes")
        print("4. Supprimer un compte")
        print("5. Retour au menu principal")
        action = input("Entrez votre choix: ").strip().lower()
        if action == "1":
            account = input("Entrez le nom du compte: ").strip()
            email = input("Entrez l'email: ").strip()
            password = input("Entrez le mot de passe: ").strip()
            add_account(account, email, password, key)
            print("Compte ajouté!")
        elif action == "2":
            account = input("Entrez le nom du compte: ").strip()
            email, password = get_account(account, key)
            if email and password:
                print(f"Email pour {account}: {email}")
                print(f"Mot de passe pour {account}: {password}")
            else:
                print("Compte non trouvé.")
        elif action == "3":
            accounts = list_accounts()
            if accounts:
                print("Comptes enregistrés:")
                for acc in accounts:
                    print(f"- {acc}")
            else:
                print("Aucun compte enregistré.")
        elif action == "4":
            account = input("Entrez le nom du compte à supprimer: ").strip()
            if delete_account(account):
                print("Compte supprimé.")
            else:
                print("Compte non trouvé.")
        elif action == "5":
            break
        else:
            print("Action non reconnue. Veuillez essayer à nouveau.")

if __name__ == "__main__":
    while True:
        print("\nMenu principal:")
        print("1. Gérer les mots de passe")
        print("2. Démarrer le serveur API")
        print("3. Quitter")
        choix = input("Entrez votre choix: ").strip()

        if choix == "1":
            manage_passwords()
        elif choix == "2":
            app.run(port=5000)
        elif choix == "3":
            break
        else:
            print("Choix non reconnu.")
