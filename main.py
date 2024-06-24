from password_manager.password_manager import *  # Importe toutes les fonctions du module password_manager
from app import app  # Importe l'application Flask depuis le module app
import os

# Assurez-vous que la clé est générée avant de continuer
if not os.path.exists("password_manager/secret.key"):
    generate_key()  # Génère une clé si elle n'existe pas encore
key = load_key()  # Charge la clé pour le cryptage


def manage_passwords():
    """Fonction pour gérer les mots de passe via une interface en ligne de commande."""
    while True:
        # Affiche le menu de gestion des mots de passe
        print("\nGestion des mots de passe:")
        print("1. Ajouter un compte")
        print("2. Récupérer un compte")
        print("3. Lister les comptes")
        print("4. Supprimer un compte")
        print("5. Retour au menu principal")
        action = input("Entrez votre choix: ").strip().lower()

        if action == "1":
            # Ajouter un compte
            account = input("Entrez le nom du compte: ").strip()
            email = input("Entrez l'email: ").strip()
            password = input("Entrez le mot de passe: ").strip()
            add_account(account, email, password, key)  # Ajoute le compte avec les informations fournies
            print("Compte ajouté!")

        elif action == "2":
            # Récupérer un compte
            account = input("Entrez le nom du compte: ").strip()
            email, password = get_account(account, key)  # Obtient l'email et le mot de passe associés au compte
            if email and password:
                print(f"Email pour {account}: {email}")
                print(f"Mot de passe pour {account}: {password}")
            else:
                print("Compte non trouvé.")

        elif action == "3":
            # Lister les comptes
            accounts = list_accounts()  # Récupère la liste de tous les comptes
            if accounts:
                print("Comptes enregistrés:")
                for acc in accounts:
                    print(f"- {acc}")
            else:
                print("Aucun compte enregistré.")

        elif action == "4":
            # Supprimer un compte
            account = input("Entrez le nom du compte à supprimer: ").strip()
            if delete_account(account):  # Supprime le compte
                print("Compte supprimé.")
            else:
                print("Compte non trouvé.")

        elif action == "5":
            # Retour au menu principal
            break

        else:
            print("Action non reconnue. Veuillez essayer à nouveau.")


if __name__ == "__main__":
    while True:
        # Affiche le menu principal
        print("\nMenu principal:")
        print("1. Gérer les mots de passe")
        print("2. Démarrer le serveur API")
        print("3. Quitter")
        choix = input("Entrez votre choix: ").strip()

        if choix == "1":
            manage_passwords()  # Appelle la fonction de gestion des mots de passe
        elif choix == "2":
            app.run(port=5000)  # Démarre le serveur API Flask sur le port 5000
        elif choix == "3":
            break  # Quitte le programme
        else:
            print("Choix non reconnu.")
