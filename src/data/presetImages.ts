export interface ImagePreset {
  id: string;
  name: string;
  category: 'coffee' | 'bakery' | 'profile';
  url: string;
  description: string;
}

export const COFFEE_PRESETS: ImagePreset[] = [
  {
    id: 'c1',
    name: 'Espresso Maestro',
    category: 'coffee',
    url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
    description: 'Double ristretto with golden hazelnut crema in matte dark cup'
  },
  {
    id: 'c2',
    name: 'Caramel Macchiato',
    category: 'coffee',
    url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=800&q=80',
    description: 'Steamed milk stained with espresso and caramel ribbons'
  },
  {
    id: 'c3',
    name: 'Spanish Latte',
    category: 'coffee',
    url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
    description: 'Sweet condensed milk blended with velvet espresso and cinnamon'
  },
  {
    id: 'c4',
    name: 'Iced Americano',
    category: 'coffee',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    description: 'Chilled single-origin shots poured over crystal ice cubes'
  },
  {
    id: 'c5',
    name: 'Velvet Cappuccino',
    category: 'coffee',
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    description: 'Microfoam crown with intricate swan latte art'
  },
  {
    id: 'c6',
    name: 'Mocha Supreme',
    category: 'coffee',
    url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    description: 'Dark Belgian chocolate ganache fused with espresso'
  }
];

export const BAKERY_PRESETS: ImagePreset[] = [
  {
    id: 'b1',
    name: 'Butter Croissant',
    category: 'bakery',
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    description: 'Golden, honeycomb flaky French butter croissant'
  },
  {
    id: 'b2',
    name: 'Velvet Cheesecake',
    category: 'bakery',
    url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    description: 'New York style baked cheesecake with Madagascar vanilla'
  },
  {
    id: 'b3',
    name: 'Artisan Fudge Brownie',
    category: 'bakery',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Warm double fudge brownie with toasted walnuts'
  }
];

export const PROFILE_PRESETS: ImagePreset[] = [
  {
    id: 'p1',
    name: 'Ahnaf (Super Admin)',
    category: 'profile',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    description: 'Master Roaster & Founder'
  },
  {
    id: 'p2',
    name: 'Maya Chowdhury (Head Barista)',
    category: 'profile',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    description: 'Lead Barista & Sensory Specialist'
  },
  {
    id: 'p3',
    name: 'Tariqul Islam (Barista & POS)',
    category: 'profile',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    description: 'Counter Specialist & Customer Host'
  },
  {
    id: 'p4',
    name: 'Sofia Rahman (Customer Connoisseur)',
    category: 'profile',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    description: 'Verified Ahnaf Member'
  }
];

export const DEFAULT_COFFEE_FALLBACK = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80';
export const DEFAULT_AVATAR_FALLBACK = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80';
