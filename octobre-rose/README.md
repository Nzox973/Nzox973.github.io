# Octobre Rose

Un site indépendant de sensibilisation au cancer du sein, en français. Design éditorial, illustration originale du ruban rose, navigation mobile, repères selon l'âge, mémo téléchargeable et questions fréquentes.

**Site : https://nzox973.github.io/octobre-rose/**

**Code : https://github.com/Nzox973/Nzox973.github.io/tree/main/octobre-rose**

Ce projet est publié dans un dossier séparé `octobre-rose/` du dépôt existant, sans modification des fichiers du portfolio. Cette publication utilise l'accès d'écriture GitHub disponible, qui ne permet pas de créer de nouveaux dépôts.

## Développement

Le site utilise HTML, CSS et JavaScript natifs. Aucune dépendance ni compilation.

Depuis le dossier du projet `octobre-rose/` :

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Pour vérifier également le chemin de GitHub Pages, servir la racine du dépôt parent `Nzox973.github.io`, puis ouvrir le chemin `/octobre-rose/` sur le serveur local. Le lien de retour de la page 404 utilise ce chemin de publication.

Vérification de syntaxe :

```bash
node --check assets/js/main.js
```

Vérifications fonctionnelles : navigation sur ordinateur et mobile ; onglets d'âge au clic et au clavier ; FAQ ; téléchargement du mémo ; fenêtre À propos et fermeture avec Échap. Vérifier les ressources et l'absence de défilement horizontal à 320, 390, 768 et 1440 pixels. Le contenu principal et les liens restent accessibles sans JavaScript.

## Publication

GitHub Pages publie la branche `main`, dossier `/` (racine) du dépôt parent. Les fichiers d'Octobre Rose se trouvent dans `octobre-rose/`. Les liens internes et les ressources utilisent des chemins relatifs compatibles avec ce préfixe. Le site est statique et n'utilise pas Jekyll. La page `404.html` du projet reste directement consultable ; pour les URL inconnues, GitHub Pages utilise la page 404 à la racine du dépôt parent.

## Contenu et confidentialité

Les repères médicaux sont des informations générales sur le dépistage organisé en France et ne remplacent pas un avis professionnel. Sources proposées : [Assurance Maladie](https://www.ameli.fr/assure/sante/themes/cancer-sein), [Institut national du cancer](https://www.cancer.fr/) et [Ligue contre le cancer](https://www.ligue-cancer.net/).

Ce projet n'est affilié à aucun de ces organismes. Il ne collecte ni dons ni données de santé. Aucun formulaire, outil d'analytics ou cookie n'est ajouté par le projet. Le mémo est généré dans le navigateur, sans envoi vers un serveur.
