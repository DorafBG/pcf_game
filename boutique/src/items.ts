// toutes les categories de cosmetiques
export type CosmeticCategory = 
  | 'ROCK'
  | 'PAPER'
  | 'SCISSORS'
  | 'VICTORY_ANIMATION'
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

// Initialisation de la boutique avec quelques items
// TODO : A ENLEVER ET METTRE UNE INIT DANS BDD POSTEGRESQL PRISMA
export const items: CosmeticItem[] = [
  {
    id: '1',
    name: 'Pierre de Magma',
    category: 'ROCK',
    price: 100,
    description: 'Une pierre incandescente tout droit sortie d\'un volcan.'
  },
  {
    id: '2',
    name: 'Feuille Dorée',
    category: 'PAPER',
    price: 150,
    description: 'Une feuille remplie d\'or juste pour Louis !'
  },
  {
    id: '3',
    name: 'Ciseaux Cyberpunk',
    category: 'SCISSORS',
    price: 200,
    description: 'Des lames d\'énergie tranchantes et lumineuses.'
  },
  {
    id: '4',
    name: 'Danse de la Victoire',
    category: 'VICTORY_ANIMATION',
    price: 300,
    description: 'Une petite danse narguant l\'adversaire après un duel gagné.'
  },
  {
    id: '5',
    name: 'Avatar Maître Shifumi',
    category: 'AVATAR',
    price: 250,
    description: 'Photo de profil d\'un vénérable sage du Chifoumi.'
  },
  {
    id: '6',
    name: 'Le Puits',
    category: 'WELL',
    price: 9999,
    description: 'L\'arme secrète interdite : bat la pierre et les ciseaux !',
    imageUrl: '/api/v1/boutique/images/puits.png'
  }
];
