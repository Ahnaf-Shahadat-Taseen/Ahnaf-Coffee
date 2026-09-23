import { Product, UserProfile, Order, Review } from '../types';
import { COFFEE_PRESETS, BAKERY_PRESETS, PROFILE_PRESETS } from './presetImages';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-espresso-maestro',
    name: 'Espresso Maestro',
    description: 'Double shot of single-origin Ethiopian beans with thick hazelnut crema and notes of dark cocoa and bergamot.',
    price: 190,
    category: 'Hot Coffee',
    imageUrl: COFFEE_PRESETS[0].url,
    stock: 45,
    isAvailable: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-caramel-macchiato',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed whole milk with vanilla syrup, marked with espresso shots and cross-hatched with house-made salted caramel drizzle.',
    price: 320,
    category: 'Hot Coffee',
    imageUrl: COFFEE_PRESETS[1].url,
    stock: 38,
    isAvailable: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-spanish-latte',
    name: 'Spanish Latte',
    description: 'A luxurious Spanish style espresso drink infused with sweetened condensed milk and cinnamon dust.',
    price: 340,
    category: 'Hot Coffee',
    imageUrl: COFFEE_PRESETS[2].url,
    stock: 50,
    isAvailable: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-iced-americano',
    name: 'Iced Americano',
    description: 'Crisp espresso shots blended with icy pure spring water, presenting a bright, clean, refreshing citrus finish.',
    price: 220,
    category: 'Cold Brews',
    imageUrl: COFFEE_PRESETS[3].url,
    stock: 60,
    isAvailable: true,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-velvet-cappuccino',
    name: 'Velvet Cappuccino',
    description: 'Equal parts espresso, hot steamed milk, and dense microfoam dusted with organic single-estate cocoa.',
    price: 280,
    category: 'Hot Coffee',
    imageUrl: COFFEE_PRESETS[4].url,
    stock: 30,
    isAvailable: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-mocha-supreme',
    name: 'Mocha Supreme',
    description: 'Rich dark Belgian melted chocolate infused with double espresso and topped with light whipped dairy cream.',
    price: 360,
    category: 'Specialty Blends',
    imageUrl: COFFEE_PRESETS[5].url,
    stock: 25,
    isAvailable: true,
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-butter-croissant',
    name: 'Butter Croissant',
    description: 'Authentic 72-layer flaky French butter pastry, baked golden every morning in our shop oven.',
    price: 180,
    category: 'Pastries & Bakery',
    imageUrl: BAKERY_PRESETS[0].url,
    stock: 20,
    isAvailable: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-velvet-cheesecake',
    name: 'Velvet Cheesecake',
    description: 'Dense and velvety cream cheese confection with an almond butter graham base and raspberry infusion.',
    price: 360,
    category: 'Pastries & Bakery',
    imageUrl: BAKERY_PRESETS[1].url,
    stock: 14,
    isAvailable: true,
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-fudge-brownie',
    name: 'Artisan Fudge Brownie',
    description: 'Warm, gooey dark cocoa brownie infused with roasted walnuts and molten chocolate drops.',
    price: 210,
    category: 'Pastries & Bakery',
    imageUrl: BAKERY_PRESETS[2].url,
    stock: 22,
    isAvailable: true,
    featured: false,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'demo-admin-ahnaf',
    email: 'ahnaf@ahnafcoffee.com',
    displayName: 'Ahnaf (Super Admin)',
    role: 'admin',
    phone: '+880 1711-002233',
    avatarUrl: PROFILE_PRESETS[0].url,
    dutyTitle: 'Founder & Head of Roasting',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'demo-staff-maya',
    email: 'maya@ahnafcoffee.com',
    displayName: 'Maya Chowdhury',
    role: 'staff',
    phone: '+880 1822-445566',
    avatarUrl: PROFILE_PRESETS[1].url,
    dutyTitle: 'Lead Barista & Quality Control',
    shift: 'Morning Shift (7:30 AM - 3:30 PM)',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'demo-staff-tariq',
    email: 'tariq@ahnafcoffee.com',
    displayName: 'Tariqul Islam',
    role: 'staff',
    phone: '+880 1933-778899',
    avatarUrl: PROFILE_PRESETS[2].url,
    dutyTitle: 'Counter Host & Cashier',
    shift: 'Evening Shift (3:00 PM - 11:00 PM)',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'demo-customer-sofia',
    email: 'sofia.rahman@gmail.com',
    displayName: 'Sofia Rahman',
    role: 'customer',
    phone: '+880 1644-112233',
    avatarUrl: PROFILE_PRESETS[3].url,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'AHN-1082',
    customerName: 'Sofia Rahman',
    customerEmail: 'sofia.rahman@gmail.com',
    customerPhone: '+880 1644-112233',
    deliveryAddress: 'House 42, Road 11, Banani, Dhaka',
    orderType: 'Cash on Delivery',
    paymentMethod: 'Cash on Delivery / Pay at Counter',
    items: [
      {
        productId: 'prod-spanish-latte',
        name: 'Spanish Latte',
        price: 340,
        quantity: 2,
        imageUrl: COFFEE_PRESETS[2].url
      },
      {
        productId: 'prod-butter-croissant',
        name: 'Butter Croissant',
        price: 180,
        quantity: 1,
        imageUrl: BAKERY_PRESETS[0].url
      }
    ],
    totalAmount: 860,
    status: 'brewing',
    userId: 'demo-customer-sofia',
    notes: 'Extra hot with less sweetness please.',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'AHN-1081',
    customerName: 'Tanvir Hossain',
    customerEmail: 'tanvir.h@outlook.com',
    customerPhone: '+880 1712-998877',
    deliveryAddress: 'Table #4 (Counter Dine-in)',
    orderType: 'Pay at Counter / Dine-in',
    paymentMethod: 'Cash on Delivery / Pay at Counter',
    items: [
      {
        productId: 'prod-caramel-macchiato',
        name: 'Caramel Macchiato',
        price: 320,
        quantity: 1,
        imageUrl: COFFEE_PRESETS[1].url
      },
      {
        productId: 'prod-velvet-cheesecake',
        name: 'Velvet Cheesecake',
        price: 360,
        quantity: 1,
        imageUrl: BAKERY_PRESETS[1].url
      }
    ],
    totalAmount: 680,
    status: 'ready',
    notes: 'Serve with fork and paper napkin',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'AHN-1080',
    customerName: 'Nabila Karim',
    customerEmail: 'nabila.k@gmail.com',
    customerPhone: '+880 1552-334455',
    deliveryAddress: 'Gulshan 2, Avenue 3, Apt 5B',
    orderType: 'Cash on Delivery',
    paymentMethod: 'Cash on Delivery / Pay at Counter',
    items: [
      {
        productId: 'prod-iced-americano',
        name: 'Iced Americano',
        price: 220,
        quantity: 2,
        imageUrl: COFFEE_PRESETS[3].url
      }
    ],
    totalAmount: 440,
    status: 'completed',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-spanish-latte',
    productName: 'Spanish Latte',
    customerName: 'Sofia Rahman',
    userId: 'demo-customer-sofia',
    rating: 5,
    comment: 'Hands down the best Spanish Latte in town! The condensed milk ratio is perfection without overpowering the espresso roast.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-2',
    productId: 'prod-butter-croissant',
    productName: 'Butter Croissant',
    customerName: 'Arif Mahmud',
    rating: 5,
    comment: 'Crispy, warm, and distinctly buttery. Paired with their Espresso Maestro, it is pure bliss for my morning routine.',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    id: 'rev-3',
    productId: 'prod-velvet-cheesecake',
    productName: 'Velvet Cheesecake',
    customerName: 'Farhana Ahmed',
    rating: 5,
    comment: 'So smooth and not overly sweet. You can tell they use genuine cream cheese. Will order again on weekend counter pickup!',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
  }
];
