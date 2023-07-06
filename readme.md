# Mot-li / Joc diari

## Descripció

Joc inspirat en el Wordle del New York Times i en d'altres posteriors, però desenvolupat totalment des de zero.

En aquesta versió, el mot que s'ha de jugar cada dia no té la mateixa longitud de lletres. Pot variar entre 4 i 9 lletres, l'administrador ho decideix.

Igualment, en aquesta versió, es pot corregir qualsevol lletra en qualsevol posició, sense haver d'esborrar-les totes.

## Us de l'aplicació

Caldrà substituir el domini actual de netlify pel de vilaweb.

### Joc

Accedir a la url: https://mot-li.netlify.app/mot-li

### Administració del joc:

Inici de sessió: https://mot-li.netlify.app/mot-li/admin-login.html

## Instal·lació normal

### Prerequisits

    npm >= 8.1
    node >= 19

### Instal·lació i execució

**Back**<br>

    npm i
    npm run build
    npm start

**Front**<br>

    npm i
    npm run build -- --base=/mot-li/

Cal executar un servidor en el port adequat per a poder navegar per l'aplicació  
Per a fer proves en local es pot executar directament npm run dev que ja executa el seu propi servidor

## Instal·lació amb Docker

S'han generat dues imatges de docker, una per l'aplicació de front i una per l'aplicació de back.

Dins de cada imatge hi ha un dockerfile amb les instruccions d'instal·lació i de construcció de l'aplicació que s'executaran en desplegar la imatge.

Un cop desplegada la imatge cal:

- Mapejar la carpeta /app/dist com la carpeta de l'aplicació, ja que és aquí on es genera la build de l'aplicació
- Fer córrer un servidor sobre el port indicat al fitxer .env per al front (en aquest cas el 8000, però es pot canviar)

## Base de dades

Es un MongoDb allotjat a Atlas. Hi ha la informació de connexió al fitxer .env del back

## ENDPOINTS API

**Front:**

Joc: /api/games/current

**Administració:**

Llistat de jocs: /api/games (GET)  
Afegir un joc: /api/games (POST)  
Edició d'un joc: /api/games/id (GET)  
Desar edició d'un joc: /api/games (PUT)  
Esborrar un joc: /api/games/id (DELETE)  
Llistat de mots: /api/words?length=X (GET)  
Afegir un mot: /api/words (POST)  
Esborrar un mot: /api/words/id (DELETE)

## Crèdits

Aplicació desenvolupada per Mario González i Núria Ramoneda, a petició de Jordi Palou.

### External credits

The accessible switch from this article: https://medium.com/@fabioiassia/exploring-an-accessible-switch-component-158b96e1bc53 and this other https://kittygiraudel.com/2021/04/05/an-accessible-toggle/

The guess bars from this pen: https://codepen.io/milacarrera/pen/pEPoez
