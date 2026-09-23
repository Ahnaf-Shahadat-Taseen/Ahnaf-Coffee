export interface SystemAccount {
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'customer';
  displayName: string;
  dutyTitle?: string;
  description: string;
}

export const SYSTEM_CREDENTIALS: SystemAccount[] = [
  {
    email: 'ahnaf@ahnafcoffee.com',
    password: 'Admin@123456',
    role: 'admin',
    displayName: 'Ahnaf (Super Admin)',
    dutyTitle: 'Founder & Head of Roasting',
    description: 'Full Super Admin access: Live BDT Revenue Analytics, Product CRUD, Staff CRUD, Order CRUD, Customer Roster & DB Seeding.'
  },
  {
    email: 'admin@ahnafcoffee.com',
    password: 'Admin@123456',
    role: 'admin',
    displayName: 'Ahnaf (Super Admin)',
    dutyTitle: 'Super Admin',
    description: 'Alternative Admin login.'
  },
  {
    email: 'taseen2001@gmail.com',
    password: 'Admin@123456',
    role: 'admin',
    displayName: 'Taseen / Ahnaf (Super Admin)',
    dutyTitle: 'Super Admin',
    description: 'Owner verified account.'
  },
  {
    email: 'maya@ahnafcoffee.com',
    password: 'Staff@123456',
    role: 'staff',
    displayName: 'Maya Chowdhury',
    dutyTitle: 'Lead Barista & Quality Control',
    description: 'Staff Barista access: Live Brewing Queue, 1-Click Status Transitions, Walk-in Counter POS Ticket Puncher, Quick Stock +5/-1.'
  },
  {
    email: 'staff@ahnafcoffee.com',
    password: 'Staff@123456',
    role: 'staff',
    displayName: 'Maya Chowdhury (Barista)',
    dutyTitle: 'Staff Barista',
    description: 'Alternative Staff login.'
  },
  {
    email: 'sofia.rahman@gmail.com',
    password: 'Customer@123456',
    role: 'customer',
    displayName: 'Sofia Rahman',
    dutyTitle: 'Coffee Enthusiast',
    description: 'Customer Storefront: Browse Menu, Cash on Delivery / Counter Dine-in Checkout, Real-time Order Tracking, and 5-Star Reviews.'
  },
  {
    email: 'customer@ahnafcoffee.com',
    password: 'Customer@123456',
    role: 'customer',
    displayName: 'Coffee Connoisseur',
    dutyTitle: 'Customer Patron',
    description: 'Alternative Customer login.'
  }
];
