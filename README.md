# Target Finder

Het welbekende spel Call of Duty heeft al een poos een mobiele versie uitgebracht voor op de smartphone. Met meer dan 300 miljoen downloads heeft dit spel zeker wel het hart gewonnen van de spelers wereldwijd. Daarom heb ik een matching applicatie bedacht die je sneller verbindt met spelers over de hele wereld!

# Mijn feature
Als feature heb ik voor matching gekozen. Als iemand mij liked en ik hem, dan krijgen wij een match! Dit komt dan in een lijstje te staan. Je kan ook swipen door middel van een javascript library genaamd Swipe-listener. 

![Match](images/match.jpg)

# Installatie
Kopieer de repository naar je eigen machine en installeer de bijbehorende package:

> git clone https://github.com/akshay197/BlokTech.git


> npm install

Nu kan je de applicatie starten door deze commando uit te voeren:

> npm start


> Example app listening at http://localhost:3000


> Connected to database

# Database
De database heet myFirstDatabase en de collectie daarin heet users. Een user ziet er zo uit:
```Java
_id: ObjectId("007")        ObjectId (automatisch gegenereerd)
naam: "Akshay Kumar"        String
leeftijd: "24"              String
beschrijving: "Test"        String
locatie: "Amsterdam"        String
image: "images/image.jpg"   String
likes:                      Array
    ObjectId("008")         ObjectId
dislikes:                   Array
    ObjectId("009")         ObjectId
```

# Documentatie
Klik [hier](https://github.com/akshay197/BlokTech/wiki) voor de wiki.

# License
MIT Licensed.
