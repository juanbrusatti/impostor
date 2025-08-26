# Imposter Game ⚽

This project is an interactive web application for playing the "Imposter Game" with soccer players. It allows you to select a player category, customize the roster, assign roles, and display cards for each participant.

## Features
- Player category selection (preloaded presets and custom option)
- Player roster customization
- Role assignment: innocents and impostors
- Interactive card display for each player
- Responsive and mobile-optimized design
- Automatic scrolling in the card view for large groups
- Modern interface with React, Next.js, and Tailwind CSS

## Installation
1. Clone the repository:
```bash
git clone https://github.com/your-user/imposter-game.git
```
2. Install dependencies:
```bash
cd impostor-game
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open the app in your browser at `http://localhost:3000`

## Project Structure
```
├── src/
│ ├── app/
│ │ ├── layout.js
│ │ ├── page.js
│ │ └── globals.css
│ ├── components/
│ │ ├── GameModeSelector.js
│ │ ├── PresetSelector.js
│ │ ├── RoleSelector.js
│ └── data/
│ └── playerPresets.js
├── public/
│ └── ... (assets)
├── package.json
├── tailwind.config.js
├── next.config.mjs
└── README.md
```

## Technologies Used
- React
- Next.js
- Tailwind CSS
- PostCSS

## Usage
1. Select the game mode and player category.
2. Customize the list if desired.
3. Configure the number of innocents and impostors.
4. View the cards and play with your group.

## Contributions
Contributions are welcome! You can open issues or submit pull requests to improve the game.

## License
This project is under the MIT license.

---
Made with ❤️ by Delay 🐢 and collaborators.
