___
#### *PDG 2024*
#### ***Auteurs : Edwin Häffner, Guillaume Dunant, Arthur Junod, Valentin Bonzon***
___
# Trivia 99

<img src="Images/Trivia_99.png" width="500" alt="logo">

___
# Description du projet

## Problématique
Les jeux télévisés de culture générale, qui étaient autrefois majoritairement populaire au sein des EMS et du troisième âge, retrouvent aujourd'hui un second souffle. 
La culture générale est en train de devenir une tendance, car elle permet de satisfaire la curiosité, d'entrainer la mémoire et d'apprendre sur notre monde.
Cependant, il est encore difficile de participer aux jeux comme "Question pour un champion" ou "Le Grand Slam", parce que le niveau y reste extrêmement élevé. 

Ces jeux télévisés arrivent souvent à insuffler un bon esprit de compétition et du suspense, car les joueurs peuvent être éliminés s'ils ne sont pas assez rapides ou ne connaissent pas la réponse. 
Il existe déjà plusieurs jeux de culture générale sur internet que l'on peut faire avec des amis ou le monde entier, mais rares sont ceux qui proposent cette même expérience de compétition. 

## Notre solution
Notre jeu **Trivia 99** permettra aux joueurs d'affronter d'autres joueurs sur leurs connaissances en culture générale, cinéma, jeux-vidéos, histoire, géographie et plus encore, les meilleurs joueurs seront les derniers survivants. Chaque joueur possède une pile qui se verra ajouter des questions à intervalles réguliers. Le but du jeu : éliminer le plus de question de sa pile pour éviter qu'elle soit remplie au maximum, le cas échéant terminera la partie du joueur. Dans le meilleur des cas, le joueur aura les connaissances nécessaires pour éliminer la question avant que la prochaine arrive. Pour les questions plus difficiles, une mauvaise réponse fera perdre du temps, la pile continuera à se remplir avec les questions suivantes.

Pour pimenter la partie, les joueurs qui répondent correctement à plusieurs questions à la suite pourront envoyer une nouvelle question à un autre joueur, augmentant la taille de sa pile. Les joueurs ciblés devront faire face aux questions supplémentaires en plus des questions habituelles. Ils devront faire preuve de rapidité et de bonne connaissance pour ne pas se laisser submerger par les questions.

# Processus de travail

## Exigences Fonctionnelles
- **Une seule session de jeu public** : Les joueurs rejoignent une session publique et attendent que la partie commence, il faut au moins 2 joueurs prêts pour lancer la partie.
- **Système de questions** : Les questions sont tirées aléatoirement d'une API open source de questions de culture générale.
- **Système de pile de questions** : Chaque joueur possède une pile de questions, il doit répondre correctement à une question pour l'éliminer de sa pile, le joueur perd la partie si sa pile est pleine et qu'il reçoit une nouvelle question.
- **Système d'attaque** : Lorsqu'un joueur répond à plusieurs questions à la suite correctement sans erreurs, il accumule une série. À chaque série, le joueur peut envoyer une question à un autre joueur en l'attaquant.
- **Thèmes aléatoires** : Les questions sont tirées aléatoirement parmi plusieurs thèmes.
- **Difficulté croissante** : Les questions deviennent de plus en plus difficile au fur et à mesure de la partie.
- **Session Guest** : Les joueurs peuvent juste choisir un pseudo et rejoindre une partie sans inscription.

## Exigences Non-Fonctionnelles
- **Jeu rapide** : Les parties doivent être rapides et dynamiques, les joueurs ne doivent pas attendre trop longtemps entre les questions et le site doit pouvoir distribuer rapidement et efficacement les questions à tous les utilisateurs.
- **Sécurité** : Les joueurs n'auront pas leurs addresses IPs exposées, les données personnelles seront protégées.
- **Responsiveness** : Le site doit être utilisable sur mobile, tablette et ordinateur.
- **Intuitif** : Le jeu doit être facile à comprendre et à prendre en main pour les nouveaux joueurs.

## Description de l'architecture 

Notre site est séparé entre un backend et un frontend. 

Le backend va communiquer avec l'API qui nous permet de récupérer les questions de culture générale et gérer la logique du jeu en s'occupant d'envoyer les questions aux joueurs/utilisateurs, éliminer les joueurs, suivre l'évolution des séries des joueurs, ...

Le frontend ne gérera que l'interface qui réagit dynamiquement aux informations qu'envoie le backend et notifiera en retour des actions de son joueur.

Le frontend et backend communiqueront grâce à des websockets ce qui permet une communication simple et rapide. Le canal bidirectionnel ouvert, quand une connection entre websocket est établie, est adaptée à notre échange d'informations présenté plus haut.

Docker nous permet d'avoir deux images différentes une pour le backend et une pour le frontend qui tourneront dans deux conteneurs différents.

Ces deux conteneurs tourneront sur une instance Google Compute Engine qui aura une IP statique et des règles de pare-feu qui autoriseront les accès HTTP et au Websocket du backend.

![Architecture](Images/Trivia99Architecture.svg)

## Mockups

[Cliquez ici](https://www.figma.com/proto/isvynhVr1etaen0j4LjXOz/Trivia99?node-id=37-1763&t=nFKCpC0W7mNDkQ5C-1&scaling=min-zoom&content-scaling=fixed&page-id=37%3A621&starting-point-node-id=37%3A622)

## Landing Page
Accessible depuis ce lien : https://guillaumednt2.github.io/Trivia99/

## Description des choix techniques 

Nous avons décidé d'utiliser NestJS car ce framework nous a été recommandé et nous voulions expérimenter avec cette nouvelle technologie. En plus, après quelque recherche, il s'est avéré que la mise ne place de websocket avec NestJS est simplifié.

SocketIo a été choisi pour la technologie WebSocket car elle est compatible avec NestJS et est une version des websockets que nous n'avions pas encore utilisée.

Nous utilisons Docker pour faire tourner notre backend et frontend sur l'Instance Google Compute Engine. Nous avons tous dans le groupe utiliser auparavant Docker donc nous savions comment le mettre en place et cela semblait être la solution la plus simple pour faire tourner notre site sur l'instance.

Watchtower nous permet de facilement récupérer les images de notre site s'il y a une nouvelle version en surveillant les repos de nos deux images Docker.

Pour le choix du fournisseur Cloud, nous avons décidé d'utiliser Google Compute Engine car leur offre d'essai nous permet d'utiliser cette technologie sans coûts.

Nous nous sommes tournés vers React afin de créer l'interface utilisateur pour sa simplicité d'utilisation et le fait que nous sommes, pour certains, déjà familier avec.

## Description du processus de travail

Nous nous sommes répartis le travail dès le début du projet. 

Pour les premiers jours, voici la répartition :
- **Arthur** : Responsable de la landing page.
- **Edwin** : Responsable du mockup de l'application.
- **Guillaume** : Mise en place de l'architecture du projet.
- **Valentin** : Mise en place du système de pipeline CI/CD sur le projet GitHub.

La rédaction du rapport se fait en commun.

Pour la suite du projet, nous nous sommes répartis ainsi :
- **Arthur** : Dev frontend
- **Guillaume** : Dev frontend
- **Edwin** : Dev backend
- **Valentin** : Dev backend
  
Cette répartition du travail est restée telle pendant les semaines de développement du projet. Mais nous collaborions étroitement entre l'équipe backend et frontend tout du long. Notamment pour les messages, certains affichages, etc.
Il fallait aussi des fois se mettre tous ensemble pour débugger des features de Trivia99.

Pour la collaboration dans le code, pour chaque fonctionnalité, nous allons créer une nouvelle issue et l'implémenter dans une branche dédiée. Une fois fonctionnelle, nous allons la fusionner avec la branche main grâce à un pull request.

Le pipeline CI/CD mise en place nous permet d'automatiser les tests, le build et le déploiement sur DockerHub de l'image du frontend et du backend.

Finalement, nous récupérons automatiquement, grâce à Watchtower, les deux images dockers depuis DockerHub sur une VM Google Compute Engine afin de nous permettre de les héberger.

## Choix d'implémentations

### Protected Routes
Nous avons décidé de mettre en place dans le router de `react-router-dom` des routes protégées pour les pages du site afin, par exemple, qu'une personne qui n'a pas rejoint la partie à temps ne puisse pas accéder à la page `/game`.

Nous utilisons les différents états de la partie (récupéré depuis le frontend en passant par le websocket) et le fait que l'utilisateur soit login (choisi un pseudo et rentré dans la partie) ou non pour définir quelle page est accessible à l'utilisateur actuel.

Les conditions sont les suivants pour chaque route protégée :
- `/` : accessible si et seulement si l'utilisateur n'est pas login.
-  `/waiting` : accessible si et seulement si l'utilisateur est login et que la partie est dans l'état `waiting`.
- `/game`: accessible si et seulement si l'utilisateur est login et si la partie est dans l'état `started`.
- `/ranking`: accessible si et seulement si l'utilisateur est login et si la partie est dans l'état `ended`.

La route `/about` n'est pas protégée et est accessible à tous.

### Système de "session"

Pour nous permettre de garder dans la partie un utilisateur qui perd la connexion, nous avons mis en place un système de "session" en utilisant les cookies.

Quand un nouvel utilisateur se connecte à notre site, il lui est attribué un id de websocket unique grâce à SocketIo. Ce premier id de socket, généré dans le backend, est envoyé au frontend qui va le stocker dans un cookie.

Si notre utilisateur perd la connexion à un moment et rouvre une nouvelle connexion websocket, il va envoyer dans le handshake de cette nouvelle connexion le cookie qui contient l'id de son premier socket enregistré ce qui permettra de l'identifier à nouveau.

````js
// Frontend
// ./server/frontend/src/App.js
// Set du cookie
const handleCookie = (serializedCookie) => {
    let [cookie, maxAge, path, , sameSite] = serializedCookie.split(";")
    const [name, value] = cookie.split("=")
    maxAge = maxAge.split("=")[1]
    path = path.split("=")[1]
    sameSite = sameSite.split("=")[1]
    setCookie(name, value, { path: path, maxAge: maxAge, sameSite: sameSite});
}

socket.on('setCookie', handleCookie);

// ./server/frontend/src/utils/socket.js
// Envoi du cookie dans le handshake
export const socket = io(URL, {
    autoConnect: true,
    auth: {
        token: document.cookie
    }
});

// Backend
// ./server/backend/src/trivia/trivia.gateway.ts
// Creation du cookie et envoi
const userId = socket.id;
const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
    sameSite: "strict" as const,
    path: "/",
};

const serializedCookie = serialize("userId", userId, cookieOptions);

socket.emit("setCookie", serializedCookie);
````

## Difficultés rencontrées

### Backend
#### Gestion de l'asynchronisme dans NestJS.

Vu que nous devons faire des requêtes à une API pour pouvoir avoir nos questions. Nous avons dû gérer beaucoup d'asynchronicité dans notre code. Notamment lors des tests, faire attention à ce que la logique du jeu se lance après que les questions soient récupérées. Beaucoup d'heure perdue à comprendre comment gérer cela correctement, mais au final nous avons réussi à mettre en place un système qui semble fonctionner sans trop d'accrocs.

#### Gestion des sockets dans NestJS.

On explique plus haut comment le système de session fonctionne, mais le développer était complexe. Trouver un moyen de faire une communication entre le backend et le frontend pour pouvoir creer une session pour l'utilisateur nous a mis beaucoup de batons dans les roues. Et même maintenant, il arrive que pour des raisons pour le moment encore inconnues des joueurs soient déconnectés.




## Améliorations futures

- **Rendre le backend stateless** : Actuellement, on garde les informations liées à la partie directement sur le backend mais il serait bien, au cas où on aurait beaucoup de joueurs, de stocker ces informations dans une base de données pour ensuite faire du scaling horizontal. 
- **Ajouter des animations** : Afin de rendre le jeu plus dynamique, il serait bien d'ajouter des animations lorsqu'un joueur répond à une question, lorsqu'il attaque un autre joueur, etc.
- **Avoir une API avec des questions de meilleures qualités** : Les questions sont très centrées sur la culture américaine. Donc la difficulté et la qualité des questions n'est pas toujours au rendez-vous, surtout pour un public européen. Il serait bien de trouver une API qui propose de meilleures questions ou même encore mieux, de créer notre propre API de questions, mais c'est un projet à part entière.

## Conclusion

Nous sommes content du résultat produit. Le jeu fonctionne même s'il reste quelques bugs à corriger. Tel que les déconnections qui semblent aléatoires de certains joueurs. Nous avons aussi fait très peu de test avec beaucoup de monde. 