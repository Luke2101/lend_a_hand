# 📦 API Setup

Um die API korrekt einzurichten, folge diesen Schritten:

---

## 1️⃣ Voraussetzungen

- MySQL muss lokal installiert und gestartet sein.
- Es muss ein MySQL-Benutzer existieren, der Zugriff auf die gewünschte Datenbank hat.

---

## 2️⃣ `.env` Datei erstellen

Lege im **`api`**-Ordner eine Datei namens `.env` an.

---

## 3️⃣ Umgebungsvariablen hinzufügen

Füge folgende Variablen in die `.env` Datei ein:

```env
DATABASE=DATENBANK_NAME
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATENBANK_NAME"
