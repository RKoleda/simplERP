
# ERP-System – README

##  Features
- **Frontend**: React + Vite + Tailwind (Port 3000)
- **Backend**: Node.js + Express + JSON-Dateien als DB (Port 5000)
- **Auth**: JWT mit Token im `localStorage`
- **Modules**: Kunden, Aufträge, Lager, CRM
- **Extras**: PDF-/CSV-Export, Suche, Filter, Farb-Highlights, Toastify-Feedback

## Docker-Setup

### 1️⃣ Projektstruktur
```
erp/
├── erp-backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── package.json
│   ├── data/
│   │   ├── customers.json
│   │   ├── orders.json
│   │   ├── products.json
│   │   └── crm.json
├── erp-frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── src/
└── docker-compose.yml
```

### 2️⃣ Docker-Build & Start
Im Projekt-Root:
```
docker-compose up --build
```

Danach:
```
docker-compose up
```

### 3️⃣ Zugriff
| Service   | URL                                      |
| --------- | ---------------------------------------- |
| Backend   | [http://localhost:5000](http://localhost:5000) |
| Frontend  | [http://localhost:3000](http://localhost:3000) |

### 4️⃣ Frontend-Features
 Authentifizierung (JWT)  
 CRUD für Kunden, Aufträge, Lager  
 CRM/Vertrieb mit Leads  
 PDF- und CSV-Export  
 Responsive Dashboard  
 Dringlichkeits-Highlights (gelb/rot)  
 Modals für „Neu hinzufügen“, „Alle Anzeigen“  
 Suche und Filter in jeder Liste

### 5️⃣ Backend-Features
 REST-API (`/api/customers`, `/api/orders`, `/api/products`, `/api/crm`)  
 JSON-Dateien als Storage (persistente Daten)  
 PDF-Export für Lager  
 Auth mit JWT-Token  

### 6️⃣ Fehlerbehebung
Falls Ports blockiert:
- Lokale Server beenden (z. B. `npx nodemon server.js`)
- Docker-Container stoppen:
```
docker-compose down
```
- Neu starten:
```
docker-compose up
```

### 7️⃣ ToDos
- Optional: Azure-Deployment vorbereiten
- Charts & Analytics hinzufügen
- User-Management (Rollen, Rechte)
