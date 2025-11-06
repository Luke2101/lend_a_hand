 # 🚀 Projekt Setup & Startanleitung

 Willkommen zu diesem Projekt!  
 Diese Anleitung beschreibt Schritt für Schritt, wie du das Backend (API) und das Frontend lokal startklar machst.

 ---

 ## 🗄️ Voraussetzungen

 - **Node.js** (empfohlen: v18 oder höher)  
 - **npm** oder **yarn**  
 - **Docker** & **Docker Compose** (für die Datenbank)

 ---

 ## ⚙️ Backend Setup (/api)

 ### 1. MySQL-Datenbank bereitstellen

 Für das Projekt wird eine **MySQL-Datenbank** benötigt.  
 Wenn du keine lokale Datenbank installiert hast, kannst du einfach die mitgelieferte Docker-Umgebung starten:

 ```bash
 cd api
 docker-compose up -d
 ```

 Die `docker-compose.yaml` befindet sich unter:  
 `/api/docker-compose.yaml`

 ---

 ### 2. Umgebungsvariablen konfigurieren

 Im Verzeichnis `/api` befindet sich eine Beispiel-Umgebungsdatei:

 ```
 /api/.env.example
 ```

 Kopiere oder benenne diese Datei um zu `.env`:

 ```bash
 cp .env.example .env
 ```

 Wenn du **nicht** die Docker-Datenbank verwendest, sondern eine eigene lokale Instanz,  
 musst du die Verbindungsdaten ggf. anpassen.

 So sollte deine `.env` am Ende aussehen:

 ```env
 DB_HOST=localhost
 DB_PORT=3306
 DB_USER=api
 DB_PASS=api
 DB_ROOT_PASS=root
 DB_NAME=api_db
 ```

 ---

 ### 3. Initiales Setup ausführen

 Im `/api`-Ordner den ersten Setup-Run starten:

 ```bash
 npm run firstTimeSetup
 ```

 Dadurch werden alle benötigten Pakete installiert und eventuell notwendige Datenbankinitialisierungen vorgenommen.

 ---

 ### 4. API starten

 Zum Starten der API:

 ```bash
 npm run start
 ```

 Die API ist danach erreichbar unter:

 ```
 http://localhost:3000
 ```

 ---

 ## 🖥️ Frontend Setup (/frontend)

 ### 1. Abhängigkeiten installieren

 ```bash
 cd frontend
 npm install
 ```

 ### 2. Entwicklungsserver starten

 ```bash
 npm run dev
 ```

 Das Frontend ist anschließend erreichbar unter:

 ```
 http://localhost:5173
 ```
 *(oder der von Vite ausgegebenen URL)*

 ---

 ## ✅ Zusammenfassung

 | Komponente | Befehl | Beschreibung |
 |-------------|--------|--------------|
| Datenbank starten | `docker-compose up -d` | Startet MySQL über Docker |
| Env vorbereiten | `.env.example` → `.env` | Umgebungskonfiguration |
| API Setup | `npm run firstTimeSetup` | Initiales Setup im API-Ordner |
| API Start | `npm run start` | Startet das Backend |
| Frontend Setup | `npm install` | Installiert Frontend-Abhängigkeiten |
| Frontend Start | `npm run dev` | Startet den Dev-Server |

 ---

 ## 🧩 Ordnerstruktur (Kurzüberblick)

 ```
 /
 ├── api/                  # Backend (Node.js + MySQL)
 │   ├── docker-compose.yaml
 │   ├── .env.example
 │   └── ...
 └── frontend/             # Frontend (z. B. React / Vue / Vite)
     ├── package.json
--     └── ...
-- ```

-- ---

 Viel Erfolg beim Starten des Projekts! 🚀  
 Bei Fragen oder Problemen: bitte Issue eröffnen oder im Team nachfragen.
