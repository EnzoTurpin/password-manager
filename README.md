
# Gestionnaire de Mots de Passe

Ce projet est une extension Chrome de gestion des mots de passe. Elle permet de sauvegarder, modifier et supprimer les informations de connexion (email et mot de passe) pour différents sites web, et propose une notification pour enregistrer les nouvelles informations de connexion lors de l'inscription sur un site web.

## Fonctionnalités

- **Sauvegarde des informations de connexion** : Enregistre les informations de connexion (email et mot de passe) pour différents sites web.
- **Modification des comptes enregistrés** : Permet de modifier les informations de connexion enregistrées.
- **Suppression des comptes enregistrés** : Permet de supprimer les informations de connexion enregistrées.
- **Notification de sauvegarde** : Affiche une notification pour enregistrer les nouvelles informations de connexion lors de l'inscription sur un site web.
- **Recherche de comptes** : Permet de rechercher des comptes enregistrés par site ou email.

## Installation

### Pré-requis

- Python 3.7+
- Node.js (pour les scripts npm si nécessaire)
- Chrome Browser

### Étapes

1. **Cloner le dépôt :**

    ```bash
    git clone https://github.com/votre-utilisateur/gestionnaire-de-mots-de-passe.git
    cd gestionnaire-de-mots-de-passe
    ```

2. **Installer les dépendances Python :**

    ```bash
    pip install -r requirements.txt
    ```

3. **Générer la clé de chiffrement :**

    Assurez-vous que le fichier `password_manager/secret.key` est généré avant de lancer l'application. Vous pouvez le générer manuellement :

    ```python
    from password_manager.password_manager import generate_key

    generate_key()
    ```

4. **Démarrer le serveur API Flask :**

    ```bash
    python main.py
    ```

    Choisissez l'option `2` pour démarrer le serveur API Flask.

5. **Charger l'extension dans Chrome :**

    - Ouvrez Chrome et allez à `chrome://extensions/`
    - Activez le mode développeur (coin supérieur droit)
    - Cliquez sur "Charger l'extension non empaquetée"
    - Sélectionnez le dossier `gestionnaire-de-mots-de-passe`

## Utilisation

### Ajouter un compte manuellement

1. Ouvrez l'extension en cliquant sur l'icône de l'extension dans la barre d'outils de Chrome.
2. Cliquez sur `Ajouter un compte`.
3. Remplissez les champs `Nom du compte`, `Email` et `Mot de passe`.
4. Cliquez sur `Enregistrer`.

### Modifier ou supprimer un compte

1. Ouvrez l'extension et cliquez sur `Lister les comptes`.
2. Cliquez sur le bouton `M` à côté du compte que vous souhaitez modifier ou sur le bouton `S` pour supprimer le compte.

### Sauvegarder automatiquement un compte lors de l'inscription

1. Accédez à un site d'inscription.
2. Remplissez et soumettez le formulaire d'inscription.
3. Une notification apparaîtra pour vous demander si vous souhaitez enregistrer les informations de connexion. Cliquez sur `Oui` pour enregistrer les informations.

### Recherche de comptes

1. Ouvrez l'extension et cliquez sur `Lister les comptes`.
2. Utilisez la barre de recherche pour trouver des comptes par site ou email.

## Structure du Projet

```plaintext
gestionnaire-de-mots-de-passe/
│
├── password_manager/
│   ├── __init__.py
│   ├── password_manager.py
│   └── secret.key (généré par votre script, n'est pas présent initialement)
│
├── password_manager_extension/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   ├── background.js
│   ├── content.js
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
│
├── app.py
├── main.py
├── requirements.txt
└── README.md
```

## Contribuer

Les contributions sont les bienvenues ! Veuillez créer une issue ou une pull request pour toute suggestion ou amélioration.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
