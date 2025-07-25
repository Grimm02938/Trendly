# Trendly - Shopify Theme

Un thème Shopify moderne et responsive inspiré du design OddityMall, parfait pour les boutiques de dropshipping et e-commerce.

## 🎨 Caractéristiques

### Design
- **Design moderne** avec gradients et animations CSS
- **Mode sombre/clair** avec toggle automatique
- **Icônes OddityMall** - 9 catégories avec icônes colorées et amusantes
- **Responsive** - optimisé pour mobile, tablette et desktop
- **Typographie Inter** - police moderne et lisible

### Fonctionnalités
- **Header avec recherche** - barre de recherche intégrée
- **Navigation mobile** - menu hamburger avec overlay
- **Grille de catégories** - 9 catégories avec icônes personnalisées
- **Produits tendance** - section produits avec badges discount
- **Cartes produit** - design moderne avec hover effects
- **Dark mode** - toggle entre mode clair et sombre
- **SEO optimisé** - meta tags et structure semantic

### Sections Disponibles
- `hero` - Section héro avec CTA
- `categories` - Grille de catégories avec icônes
- `trending-products` - Produits tendance
- `header` - En-tête avec navigation
- `footer` - Pied de page complet

## 📁 Structure des Fichiers

```
shopify-theme/
├── assets/
│   ├── theme.css          # Styles principaux
│   └── theme.js           # JavaScript du thème
├── config/
│   ├── settings_schema.json  # Configuration du thème
│   └── settings_data.json    # Données par défaut
├── layout/
│   └── theme.liquid       # Layout principal
├── sections/
│   ├── header.liquid      # En-tête
│   ├── hero.liquid        # Section héro
│   ├── categories.liquid  # Grille catégories
│   ├── trending-products.liquid  # Produits tendance
│   └── footer.liquid      # Pied de page
├── templates/
│   ├── index.liquid       # Page d'accueil
│   ├── product.liquid     # Page produit
│   ├── collection.liquid  # Page collection
│   └── page.liquid        # Pages génériques
├── snippets/
│   ├── product-card.liquid    # Carte produit
│   ├── category-icon.liquid   # Icônes de catégories
│   └── meta-tags.liquid      # Meta tags SEO
├── locales/
│   └── en.default.json    # Traductions anglaises
└── README.md              # Ce fichier
```

## 🚀 Installation sur Shopify

### Méthode 1: Upload ZIP
1. **Compressez le dossier** `shopify-theme` en fichier ZIP
2. **Connectez-vous** à votre admin Shopify
3. Allez dans **Online Store > Themes**
4. Cliquez sur **Upload theme**
5. **Sélectionnez** le fichier ZIP et uploadez
6. **Publiez** le thème une fois installé

### Méthode 2: Shopify CLI (Recommandé)
```bash
# Installer Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Se connecter à votre boutique
shopify auth login

# Naviguer vers le dossier du thème
cd shopify-theme

# Pousser le thème vers Shopify
shopify theme push

# Ou pour développement en temps réel
shopify theme dev
```

### Méthode 3: Upload Manuel
1. **Connectez-vous** à votre admin Shopify
2. Allez dans **Online Store > Themes**
3. Cliquez sur **Actions > Edit code** sur un thème existant
4. **Créez** ou remplacez chaque fichier individuellement
5. **Copiez-collez** le contenu de chaque fichier

## ⚙️ Configuration

### 1. Collections Recommandées
Créez ces collections dans Shopify pour une intégration parfaite :
- `makeup` - Makeup & Beauty
- `tech` / `electronics` / `high-tech` - High Tech
- `trending` / `tiktok` / `viral` - TikTok Trends
- `fashion` / `clothing` - Fashion
- `home` / `home-living` / `decor` - Home & Living
- `outdoor` / `garden` - Outdoor & Garden
- `health` / `wellness` - Health & Wellness
- `sports` / `fitness` - Sports & Fitness
- `cooking` / `kitchen` / `food` - Cooking

### 2. Menus de Navigation
Créez ces menus dans **Navigation** :
- `main-menu` - Menu principal (header)
- `footer` - Liens du footer
- `footer-legal` - Liens légaux (privacy, terms, etc.)

### 3. Pages Recommandées
Créez ces pages pour un site complet :
- `/pages/about` - À propos
- `/pages/contact` - Contact (avec formulaire automatique)
- `/pages/shipping-returns` - Livraison et retours
- `/pages/size-guide` - Guide des tailles
- `/pages/faq` - FAQ

### 4. Paramètres du Thème
Dans **Customize theme**, vous pouvez configurer :
- **Couleurs** - Couleurs primaires et secondaires
- **Typographie** - Polices pour titres et texte
- **Header** - Affichage recherche et panier
- **Catégories** - Titre et nombre par ligne
- **Produits** - Nombre de produits tendance
- **Hero** - Titre, sous-titre, boutons CTA
- **Dark Mode** - Activer/désactiver le toggle

## 🎨 Catégories et Icônes

Le thème inclut 9 icônes de catégories personnalisées dans le style OddityMall :

1. **Makeup & Beauty** - Rouge/Rose - Tube de rouge à lèvres avec paillettes
2. **High Tech** - Cyan/Bleu - Smartphone avec barres de signal
3. **TikTok Trends** - Vert/Teal - Note musicale avec effets
4. **Fashion** - Orange/Rouge - Robe élégante avec motifs
5. **Home & Living** - Vert/Bleu - Maison avec cheminée
6. **Outdoor & Garden** - Vert/Teal - Arbre avec fleurs
7. **Health & Wellness** - Rouge/Rose - Croix médicale avec cœurs
8. **Sports & Fitness** - Orange/Jaune - Ballon de basket
9. **Cooking** - Jaune/Orange - Part de pizza avec vapeur

## 🛠️ Personnalisation

### Modifier les Couleurs
Dans `assets/theme.css`, ajustez les variables CSS :
```css
:root {
  --color-primary: #e11d48;    /* Rose principal */
  --color-secondary: #ec4899;  /* Rose secondaire */
  --color-background: #ffffff; /* Arrière-plan */
  --color-text: #1f2937;       /* Texte */
}
```

### Ajouter des Sections
1. Créez un nouveau fichier dans `sections/`
2. Ajoutez le schema JSON en bas du fichier
3. Incluez la section dans les templates

### Modifier les Icônes
Les icônes sont dans `snippets/category-icon.liquid`. Chaque icône est un SVG personnalisable.

## 📱 Responsive Design

Le thème est optimisé pour :
- **Mobile** - 3 colonnes catégories, menu hamburger
- **Tablette** - 4 colonnes catégories, barre de recherche
- **Desktop** - 6 colonnes catégories, navigation complète

## 🔧 Support Navigateurs

- **Chrome** - Dernières versions
- **Firefox** - Dernières versions  
- **Safari** - Dernières versions
- **Edge** - Dernières versions
- **Mobile** - iOS Safari, Chrome Mobile

## 📈 SEO et Performance

### SEO
- Meta tags automatiques
- Structure sémantique HTML5
- Open Graph et Twitter Cards
- URLs canoniques
- Schema.org markup

### Performance  
- CSS et JS optimisés
- Images lazy loading
- Animations CSS3 hardware-accelerated
- Code minifié en production

## 🆘 Dépannage

### Le thème ne s'affiche pas correctement
1. Vérifiez que tous les fichiers sont uploadés
2. Assurez-vous que le thème est publié
3. Videz le cache du navigateur

### Les catégories n'apparaissent pas
1. Créez les collections recommandées
2. Ajoutez des produits aux collections
3. Vérifiez les handles des collections

### Le dark mode ne fonctionne pas
1. Vérifiez que JavaScript est activé
2. Regardez la console pour les erreurs
3. Assurez-vous que le toggle est activé dans les paramètres

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez la documentation Shopify
2. Consultez les logs d'erreur dans la console
3. Testez sur différents navigateurs

## 📄 License

Ce thème est fourni "tel quel" pour usage personnel et commercial.

---

**Trendly Theme** - Un thème Shopify moderne pour le dropshipping et e-commerce 🚀