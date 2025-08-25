export const playerPresets = {
  premierLeague: {
    id: 'premierLeague',
    name: 'Premier League',
    players: [
      'Erling Haaland',
      'Kevin De Bruyne',
      'Mohamed Salah',
      'Harry Kane',
      'Virgil van Dijk',
      'Bruno Fernandes',
      'Bukayo Saka',
      'Martin Ødegaard',
      'Marcus Rashford',
      'Trent Alexander-Arnold'

    ]
  },
  argentinian: {
    id: 'argentinian',
    name: 'Jugadores Argentinos',
    players: [
      'Lionel Messi',
      'Ángel Di María',
      'Emiliano Martínez',
      'Lautaro Martínez',
      'Rodrigo De Paul',
      'Enzo Fernández',
      'Cristian Romero',
      'Julián Álvarez',
      'Leandro Paredes',
      'Nicolás Otamendi',
      'Óscar Ruggeri',
      'Marcos Rojo',
      'Enzo Pérez',
      'Mario Kempes',
      'Erling Haaland',
      'Kevin De Bruyne',
      'Mohamed Salah',
      'Harry Kane',
      'Virgil van Dijk',
      'Bruno Fernandes',
      'Bukayo Saka',
      'Martin Ødegaard',
      'Marcus Rashford',
      'Trent Alexander-Arnold',
      'Manuel Neuer',
      'Virgil van Dijk',
      'Sergio Ramos',
      'Gerard Piqué'   
    ]
  },
  europeanStars: {
    id: 'european',
    name: 'Estrellas de Europa',
    players: [
      'Kylian Mbappé',
      'Karim Benzema',
      'Luka Modrić',
      'Robert Lewandowski',
      'Kevin De Bruyne',
      'Vinicius Junior',
      'Jude Bellingham',
      'Thibaut Courtois',
      'Antoine Griezmann',
      'Joshua Kimmich'
    ]
  },
  custom: {
    id: 'custom',
    name: 'Personalizado',
    players: []
  }
};

export const getPresetById = (id) => {
  return playerPresets[id] || playerPresets.custom;
};
