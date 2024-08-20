#### PDG 2024
#### Auteurs : Edwin Häffner, Guillaume Dunant, Arthur Junod, Valentin Bonzon


# Trivia 99

## Problématique
Les jeux télévisés de culture générale qui étaient autrefois majoritairement populaire au sein des EMS et du troisième âge, retrouvent aujourd'hui un second souffle. 
La culture générale est en train de devenir une tendance car elle permet de satisfaire la curiosité, d'entrainer la mémoire et d'apprendre sur notre monde.
Cependant il est encore difficile de participer aux jeux comme "Question pour un champion" ou "Le Grand Slam" car le niveau y reste extrêmement élevé. 

Ces jeux télévisés arrivent souvent à insufler un bon esprit de compétition et du suspense car les joueurs peuvent être éliminés s'ils ne sont pas assez rapides ou ne connaissent pas la réponse. 
Il existe déjà plusieurs jeux de culture générale sur internet que l'on peut faire avec des amis ou le monde entier, mais rares sont ceux qui proposent cette même expérience de compétition. 

## Notre solution
Notre jeu **Trivia 99** permettra aux joueurs d'affronter d'autres joueurs sur leurs connaissances en culture générale, cinéma, jeux-vidéos, histoire, géographie et plus encore, les meilleurs joueurs seront les derniers survivants. Chaque joueur possède une pile qui se verra ajouter des questions à intervalles réguliers. Le but du jeu : éliminer le plus de question de sa pile pour éviter qu'elle soit remplie au maximum, le cas échéant terminera la partie du joueur. Dans le meilleur des cas, le joueur aura les connaissances nécessaire pour éliminer la question avant que la prochaine arrive. Pour les questions plus difficile, une mauvaise réponse fera perdre du temps, la pile continuera à se remplir avec les questions suivante.

Pour pimenter la partie, les joueurs qui répondent correctement à plusieurs questions à la suite pourront envoyer une nouvelle question à un autre joueur, augmentant la taille de sa pile. Les joueurs ciblés devront faire face aux questions supplémentaires en plus des questions habituelles. Ils devront faire preuve de rapidité et de bonne connaissance pour ne pas se laisser submerger par les questions.

## Processus de travail

### Description du projet
#### 1. Exigence Fonctionnelles
- **Un seul lobby public** : Les joueurs rejoignent un lobby public et attendent que la partie commence, il faut au moins 2 joueurs prêts pour lancer la partie.
- **Système de questions** : Les questions sont tirées aléatoirement d'une API open source de questions de Trivia.
- **Système de pile de questions** : Chaque joueur possède une pile de questions, il doit répondre correctement à une question pour l'éliminer de sa pile, le joueur perds la partie si sa pile est pleine et qu'il reçoit une nouvelle question.
- **Système d'attaque** : Lorsqu'un joueur réponds à plusieurs question à la suite correctement sans erreur, il accumule une série. A chaque série, le joueur peut envoyer une question à un autre joueur !
- **Thèmes aléatoires** : Les questions sont tirées aléatoirement parmi plusieurs thèmes. 
- **Difficulté croissante** : Les questions deviennent de plus en plus difficile au fur et à mesure de la partie.
- **Session Guest** : Les joueurs peuvent juste choisir un pseudo et rejoindre une partie sans inscription.

#### 2. Exigence Non-Fonctionnelles
- **Jeu rapide** : Les parties doivent être rapides et dynamiques, les joueurs ne doivent pas attendre trop longtemps entre les questions.
- **Securité** : Les joueurs n'auront pas leurs addresse IPs exposées, les données personnelles seront protégées et le site sera en HTTPS.
- **Responsiveness** : Le site doit être utilisable sur mobile, tablette et ordinateur.
- **Intuitif** : Le jeu doit être facile à comprendre et à prendre en main pour les nouveaux joueurs.

### Description de l'architecture 
Utilisation de Socket IO, jsp

### Mockups

j'arrive pas a copier coller le lien ptdr


### Landing Page

### Description des choix techniques 

### Description du processus de travail



