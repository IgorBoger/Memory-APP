# Memory-APP

Ein Memory-Spiel für zwei Personen im Browser, entwickelt im Rahmen der Developer Akademie. Zwei Spieler treten am selben Gerät gegeneinander an und versuchen, möglichst viele Kartenpaare zu finden.

## Funktionen

- Vier Designs mit passenden Kartenmotiven: **Code vibes**, **Gaming**, **DA projects** und **Foods**.
- Wählbare Spielfeldgröße mit **16, 24 oder 36 Karten**.
- Auswahl des Startspielers: **Blau** oder **Orange**.
- Zufällig gemischte Karten, Anzeige des aktuellen Spielers und Punktestand.
- Ergebnisanzeige für Sieg oder Unentschieden.
- Bestätigungsdialog beim Verlassen einer laufenden Partie.
- Responsive Gestaltung für verschiedene Bildschirmgrößen und Vorschau der Designs in den Einstellungen.

## Spielregeln

1. Klicke auf **Play** und wähle Design, Startspieler und Kartenzahl.
2. Starte die Partie und decke zwei Karten auf.
3. Bei gleichen Motiven erhältst du einen Punkt und bist erneut am Zug.
4. Bei unterschiedlichen Motiven werden die Karten wieder verdeckt und der andere Spieler ist an der Reihe.
5. Sobald alle Paare gefunden sind, gewinnt die Person mit den meisten Punkten. Gleiche Punktzahlen ergeben ein Unentschieden.

## Technologien

- **TypeScript** für Spiellogik und Benutzeroberfläche
- **HTML** und **SCSS** für Struktur und Gestaltung
- **Vite** als Entwicklungsserver und Build-Werkzeug

## Lokal starten

Voraussetzungen: **Node.js 20.19+ innerhalb der Version 20 oder Node.js ab 22.12** sowie npm (entsprechend der Vite-Abhängigkeit im Projekt).

Öffne ein Terminal im Projektordner und installiere die Abhängigkeiten:

```sh
npm ci
```

Starte anschließend den Entwicklungsserver:

```sh
npm run dev
```

Öffne die im Terminal angezeigte Adresse im Browser. Mit dem Standardport ist das `http://localhost:5173/memory/`.

## Build und Vorschau

```sh
npm run build
```

Der Build prüft zuerst die TypeScript-Typen und erzeugt anschließend die fertige Anwendung im Ordner `dist/`.

Für eine lokale Vorschau des Builds:

```sh
npm run preview
```

Öffne die im Terminal angezeigte Vorschauadresse mit dem Pfad `/memory/`.

## Projektstruktur

```text
Memory-APP/
├── public/
│   ├── fonts/          # Lokale Schriftarten
│   └── img/            # Kartenmotive und Grafiken
├── src/
│   ├── game/           # Karten, Spielablauf und Timer
│   ├── styles/         # SCSS für Seiten und Komponenten
│   ├── templates/      # HTML-Vorlage für Karten
│   ├── ui/             # Einstellungen, Navigation und Ergebnisse
│   ├── app-context.ts  # Gemeinsamer Spielzustand
│   ├── card-data.ts    # Kartenmotive der Designs
│   ├── main.ts         # Einstiegspunkt
│   ├── theme-data.ts   # Daten für die Designs
│   └── types.ts        # TypeScript-Typen
├── index.html
├── package.json
└── vite.config.ts
```

## Bereitstellung

Die Anwendung ist in `vite.config.ts` für den Basispfad **`/memory/`** konfiguriert. Beim Veröffentlichen müssen die Inhalte von `dist/` unter diesem Pfad erreichbar sein. Für einen anderen Zielpfad muss `base` angepasst und der Build erneut erstellt werden. Das gilt auch für GitHub Pages, wenn der Repository-Pfad von `/memory/` abweicht.
