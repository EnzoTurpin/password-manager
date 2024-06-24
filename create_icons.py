from PIL import Image, ImageDraw
import os


def create_icon(size, filename):
    # Créer une nouvelle image avec fond transparent
    image = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)

    # Dessiner un simple carré bleu
    draw.rectangle([0, 0, size, size], fill=(0, 0, 255, 255))

    # Vérifier si le répertoire existe, sinon le créer
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    # Enregistrer l'image
    image.save(filename)


# Créer les icônes de différentes tailles
create_icon(16, "password_manager_extension/icons/icon16.png")
create_icon(48, "password_manager_extension/icons/icon48.png")
create_icon(128, "password_manager_extension/icons/icon128.png")

print("Icônes créées avec succès.")
