# HypocondrIHack - Système de Protection Paranoïaque

![HypocondrIHack Banner](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200&h=400)

## 🚨 Présentation

HypocondrIHack est un tableau de bord de cybersécurité conçu avec une approche paranoïaque et théâtrale, offrant une visualisation en temps réel des menaces potentielles sur votre système et votre réseau VPN. Développé avec React, Electron et TypeScript, il combine des fonctionnalités de monitoring système avec une interface utilisateur cyberpunk immersive.

## 🛡️ Fonctionnalités Principales

### Monitoring Système
- Surveillance en temps réel du CPU, de la mémoire et de la température
- Graphiques dynamiques avec animations fluides
- Alertes visuelles lors de dépassements de seuils critiques

### Analyse des Processus
- Liste détaillée des processus système en cours d'exécution
- Détection des processus suspects basée sur l'utilisation des ressources
- Indicateurs visuels pour les activités anormales

### Surveillance Réseau
- Monitoring des connexions réseau entrantes et sortantes
- Évaluation des menaces en temps réel
- Alertes pour les activités réseau suspectes

### Infrastructure VPN Multi-Sites
- Visualisation géographique des tunnels VPN sur une carte interactive
- Monitoring en temps réel de l'état des connexions
- Détection des compromissions de tunnels
- Affichage des métriques de performance (latence, statut)
- Évaluation des risques par localisation

### Système d'Alertes
- Notifications en temps réel des menaces détectées
- Historique des événements de sécurité
- Classification des alertes par niveau de gravité
- Animations visuelles pour les alertes critiques

### Console de Monitoring
- Affichage des logs système en temps réel
- Interface style terminal pour les opérations système
- Suivi des activités de sécurité

## 🔧 Technologies Utilisées

- **Frontend**: React, TypeScript, Tailwind CSS
- **Desktop**: Electron
- **Cartographie**: React Leaflet
- **Graphiques**: Chart.js
- **Icônes**: Lucide React
- **Données**: Faker.js (pour la démonstration)

## 🚀 Installation

```bash
# Cloner le repository
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run electron:dev

# Construire l'application
npm run electron:build
```

## 🎯 Utilisation

1. Lancez l'application
2. Observez les métriques système en temps réel
3. Surveillez les connexions VPN via la carte interactive
4. Monitorer les processus système suspects
5. Consultez les alertes de sécurité en temps réel

## 🎨 Design

L'interface utilisateur adopte un style cyberpunk avec :
- Une palette de couleurs néon sur fond sombre
- Des animations fluides et réactives
- Des effets visuels pour les états critiques
- Une disposition optimisée pour le monitoring

## 🔐 Sécurité

Le système intègre plusieurs niveaux de surveillance :
- Détection des activités système suspectes
- Monitoring des connexions réseau anormales
- Évaluation des risques géographiques pour les VPN
- Alertes en temps réel pour les menaces potentielles

## 🌐 Architecture VPN

Le système supporte une infrastructure VPN mondiale avec :
- 10 points de présence internationaux
- Monitoring de la latence et du statut
- Détection des compromissions
- Visualisation des connexions inter-sites

## 📝 Notes

Ce projet est conçu comme un tableau de bord de cybersécurité théâtral et éducatif. Bien qu'il utilise des données simulées, son interface et ses fonctionnalités sont inspirées des véritables outils de monitoring de sécurité.

## 🔄 État du Projet

Le projet est en développement actif avec des mises à jour régulières incluant :
- Nouvelles fonctionnalités de monitoring
- Améliorations de l'interface utilisateur
- Optimisations des performances
- Ajout de nouveaux points de présence VPN

## 📜 Licence

MIT License