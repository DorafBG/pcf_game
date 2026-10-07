// toutes les categories de cosmetiques
export type CosmeticCategory = 
  | 'ROCK'
  | 'PAPER'
  | 'SCISSORS'
  | 'AVATAR'
  | 'WELL';

// tous les attributs d'un item cosmetique
export interface CosmeticItem {
  id: string;
  name: string;
  category: CosmeticCategory;
  price: number;
  description: string;
  imageUrl?: string;
}

// on liste ici tous les items cosmetiques disponibles dans la boutique (catalogue)
// ces items sont inserees ensuite dnas la BDD postegresql via le script seed.ts
export const items: CosmeticItem[] = [
  //ROCK
  {
    id: '1',
    name: 'Le Pavé de Mai',
    category: 'ROCK',
    price: 150,
    description: 'Sous les pavés, la plage... et sous la plage, un gros caillou prêt à fracasser les ciseaux de l\'adversaire. Emballé avec amour.',
    imageUrl: '/api/v1/boutique/images/pave.png'
  },
  {
    id: '2',
    name: 'Pierre de Magma',
    category: 'ROCK',
    price: 200,
    description: 'Chauffée à blanc par la ferveur populaire et la lave en fusion. Attention les doigts, ça brûle !',
    imageUrl: '/api/v1/boutique/images/magma.png'
  },
  {
    id: '3',
    name: 'Le Menhir Syndical',
    category: 'ROCK',
    price: 180,
    description: 'Un bloc de granit breton avec son bandana rouge vif. Déterminé, musclé et indestructible face aux lames adverses.',
    imageUrl: '/api/v1/boutique/images/menhir.png'
  },

  //PAPER
  {
    id: '4',
    name: 'Le Tract Recto-Verso',
    category: 'PAPER',
    price: 120,
    description: 'Distribué à la sortie du RER à 7h du matin avec du café tiède. Plié en quatre, il enveloppe n\'importe quelle pierre sans forcer.',
    imageUrl: '/api/v1/boutique/images/tract.png'
  },
  {
    id: '5',
    name: 'Feuille Dorée Ancestrale',
    category: 'PAPER',
    price: 350,
    description: 'Un parchemin antique brodé d\'or massif. Tellement luxueux qu\'il rend jaloux les banquiers suisses.',
    imageUrl: '/api/v1/boutique/images/feuille_doree.png'
  },
  {
    id: '6',
    name: 'La Gazette du Matin',
    category: 'PAPER',
    price: 140,
    description: 'L\'édition spéciale avec un grand sourire, les mots croisés déjà remplis et la météo des luttes. Imparable contre les pavés.',
    imageUrl: '/api/v1/boutique/images/journal.png'
  },

  //SCISSORTS
  {
    id: '7',
    name: 'Ciseaux Révolutionnaires',
    category: 'SCISSORS',
    price: 220,
    description: 'Forgés avec un grand sourire moqueur pour trancher net les feuilles de budget d\'austérité.',
    imageUrl: '/api/v1/boutique/images/ciseaux_rouges.png'
  },
  {
    id: '8',
    name: 'Ciseaux Laser Cyberpunk',
    category: 'SCISSORS',
    price: 400,
    description: 'Deux lames au plasma néon tout droit sorties de 2077. Découpent le papier à la vitesse de la fibre optique.',
    imageUrl: '/api/v1/boutique/images/ciseaux_laser.png'
  },
  {
    id: '9',
    name: 'Ciseaux Dorés VIP',
    category: 'SCISSORS',
    price: 380,
    description: 'Plaqués or 24 carats reçus en prime de fin d\'année. Tellement étincelants qu\'ils tranchent le papier avec un rictus condescendant.',
    imageUrl: '/api/v1/boutique/images/ciseaux_or.png'
  },

  // AVATAR
  {
    id: '10',
    name: 'Chef Barbecue & Merguez',
    category: 'AVATAR',
    price: 250,
    description: 'Le roi incontesté de la fête de l\'Huma et des kermesses de quartier. Une pince dans chaque main, prêt à griller.',
    imageUrl: '/api/v1/boutique/images/avatar_merguez.png'
  },
  {
    id: '11',
    name: 'Le Camarade Casquette',
    category: 'AVATAR',
    price: 250,
    description: 'Toujours debout à 6h du mat avec sa casquette en tweed et son mégaphone. "On lâche rien !"',
    imageUrl: '/api/v1/boutique/images/avatar_camarade.png'
  },
  {
    id: '12',
    name: 'Maître Shifumi',
    category: 'AVATAR',
    price: 300,
    description: 'Vénérable sage shaolin capable de deviner si tu vas jouer Pierre, Feuille ou Ciseau avant même que tu n\'y penses.',
    imageUrl: '/api/v1/boutique/images/avatar_shifumi.png'
  },
  {
    id: '13',
    name: 'Le Grand Champion',
    category: 'AVATAR',
    price: 350,
    description: 'Le badge de profil de ceux qui ne connaissent que la victoire (ou la bonne foi contestable). Pluie d\'étoiles garantie.',
    imageUrl: '/api/v1/boutique/images/avatar_trophee.png'
  },

  //WELL
  {
    id: '14',
    name: 'Le Puits Nationalisé',
    category: 'WELL',
    price: 9999,
    description: 'L\'arme secrète interdite accessible à tous les cotisants ! Engloutit la pierre et noie les ciseaux (mais perd bêtement face à la feuille).',
    imageUrl: '/api/v1/boutique/images/puits.png'
  }
];
