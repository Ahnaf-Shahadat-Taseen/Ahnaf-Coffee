import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Order, UserProfile, Review, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS, INITIAL_REVIEWS } from '../data/initialSeedData';

const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const USERS_COL = 'users';
const REVIEWS_COL = 'reviews';

// Local storage backup keys for offline resilience
const LS_PRODUCTS = 'ahnaf_backup_products';
const LS_ORDERS = 'ahnaf_backup_orders';
const LS_USERS = 'ahnaf_backup_users';
const LS_REVIEWS = 'ahnaf_backup_reviews';

const loadBackup = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveBackup = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

/**
 * Seed initial data into Firestore
 */
export async function seedEntireDatabase(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    let count = 0;
    // Seed products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, PRODUCTS_COL, prod.id), prod, { merge: true });
      count++;
    }
    // Seed users
    for (const u of INITIAL_USERS) {
      await setDoc(doc(db, USERS_COL, u.uid), u, { merge: true });
      count++;
    }
    // Seed orders
    for (const ord of INITIAL_ORDERS) {
      await setDoc(doc(db, ORDERS_COL, ord.id), ord, { merge: true });
      count++;
    }
    // Seed reviews
    for (const rev of INITIAL_REVIEWS) {
      await setDoc(doc(db, REVIEWS_COL, rev.id), rev, { merge: true });
      count++;
    }

    saveBackup(LS_PRODUCTS, INITIAL_PRODUCTS);
    saveBackup(LS_USERS, INITIAL_USERS);
    saveBackup(LS_ORDERS, INITIAL_ORDERS);
    saveBackup(LS_REVIEWS, INITIAL_REVIEWS);

    return { success: true, count };
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, 'seed');
    // Fallback: seed local backups
    saveBackup(LS_PRODUCTS, INITIAL_PRODUCTS);
    saveBackup(LS_USERS, INITIAL_USERS);
    saveBackup(LS_ORDERS, INITIAL_ORDERS);
    saveBackup(LS_REVIEWS, INITIAL_REVIEWS);
    return { success: true, count: INITIAL_PRODUCTS.length + INITIAL_USERS.length, error: err.message };
  }
}

/**
 * Products Subscriptions & CRUD
 */
export function subscribeToProducts(callback: (products: Product[]) => void) {
  try {
    const colRef = collection(db, PRODUCTS_COL);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Product);
          });
          saveBackup(LS_PRODUCTS, list);
          callback(list);
        } else {
          // If firestore is empty, seed initial products
          const initial = loadBackup<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
          callback(initial);
          // Try to auto-populate in background
          INITIAL_PRODUCTS.forEach(p => {
            setDoc(doc(db, PRODUCTS_COL, p.id), p).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, PRODUCTS_COL);
        const fallback = loadBackup<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
        callback(fallback);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, PRODUCTS_COL);
    callback(loadBackup<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS));
    return () => {};
  }
}

export async function createProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<string> {
  const id = product.id || 'prod-' + Date.now();
  const newProduct: Product = {
    ...product,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, PRODUCTS_COL, id), newProduct);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${PRODUCTS_COL}/${id}`);
  }
  // Local cache update
  const current = loadBackup<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  saveBackup(LS_PRODUCTS, [newProduct, ...current]);
  return id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const updatedData = { ...updates, updatedAt: new Date().toISOString() };
  try {
    await updateDoc(doc(db, PRODUCTS_COL, id), updatedData);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${PRODUCTS_COL}/${id}`);
  }
  const current = loadBackup<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  const next = current.map(p => (p.id === id ? { ...p, ...updatedData } : p));
  saveBackup(LS_PRODUCTS, next);
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PRODUCTS_COL}/${id}`);
  }
  const current = loadBackup<Product[]>(LS_PRODUCTS, INITIAL_PRODUCTS);
  saveBackup(LS_PRODUCTS, current.filter(p => p.id !== id));
}

/**
 * Orders Subscriptions & CRUD
 */
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  try {
    const colRef = collection(db, ORDERS_COL);
    const q = query(colRef);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Order);
          });
          // Sort newest first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          saveBackup(LS_ORDERS, list);
          callback(list);
        } else {
          const fallback = loadBackup<Order[]>(LS_ORDERS, INITIAL_ORDERS);
          callback(fallback);
          INITIAL_ORDERS.forEach(o => {
            setDoc(doc(db, ORDERS_COL, o.id), o).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, ORDERS_COL);
        callback(loadBackup<Order[]>(LS_ORDERS, INITIAL_ORDERS));
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, ORDERS_COL);
    callback(loadBackup<Order[]>(LS_ORDERS, INITIAL_ORDERS));
    return () => {};
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<string> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = order.id || `AHN-${randomSuffix}`;
  const newOrder: Order = {
    ...order,
    id,
    paymentMethod: 'Cash on Delivery / Pay at Counter',
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, ORDERS_COL, id), newOrder);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${ORDERS_COL}/${id}`);
  }
  const current = loadBackup<Order[]>(LS_ORDERS, INITIAL_ORDERS);
  saveBackup(LS_ORDERS, [newOrder, ...current]);
  return id;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const updates = { status, updatedAt: new Date().toISOString() };
  try {
    await updateDoc(doc(db, ORDERS_COL, id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${ORDERS_COL}/${id}`);
  }
  const current = loadBackup<Order[]>(LS_ORDERS, INITIAL_ORDERS);
  saveBackup(LS_ORDERS, current.map(o => (o.id === id ? { ...o, ...updates } : o)));
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ORDERS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${ORDERS_COL}/${id}`);
  }
  const current = loadBackup<Order[]>(LS_ORDERS, INITIAL_ORDERS);
  saveBackup(LS_ORDERS, current.filter(o => o.id !== id));
}

/**
 * Users / Staff Subscriptions & CRUD
 */
export function subscribeToUsers(callback: (users: UserProfile[]) => void) {
  try {
    const colRef = collection(db, USERS_COL);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: UserProfile[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), uid: docSnap.id } as UserProfile);
          });
          saveBackup(LS_USERS, list);
          callback(list);
        } else {
          callback(loadBackup<UserProfile[]>(LS_USERS, INITIAL_USERS));
          INITIAL_USERS.forEach(u => {
            setDoc(doc(db, USERS_COL, u.uid), u).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, USERS_COL);
        callback(loadBackup<UserProfile[]>(LS_USERS, INITIAL_USERS));
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, USERS_COL);
    callback(loadBackup<UserProfile[]>(LS_USERS, INITIAL_USERS));
    return () => {};
  }
}

export async function createUser(user: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, USERS_COL, user.uid), user);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${USERS_COL}/${user.uid}`);
  }
  const current = loadBackup<UserProfile[]>(LS_USERS, INITIAL_USERS);
  saveBackup(LS_USERS, [user, ...current]);
}

export async function updateUser(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, USERS_COL, uid), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${USERS_COL}/${uid}`);
  }
  const current = loadBackup<UserProfile[]>(LS_USERS, INITIAL_USERS);
  saveBackup(LS_USERS, current.map(u => (u.uid === uid ? { ...u, ...updates } : u)));
}

export async function deleteUser(uid: string): Promise<void> {
  try {
    await deleteDoc(doc(db, USERS_COL, uid));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${USERS_COL}/${uid}`);
  }
  const current = loadBackup<UserProfile[]>(LS_USERS, INITIAL_USERS);
  saveBackup(LS_USERS, current.filter(u => u.uid !== uid));
}

/**
 * Reviews Subscriptions & CRUD
 */
export function subscribeToReviews(callback: (reviews: Review[]) => void) {
  try {
    const colRef = collection(db, REVIEWS_COL);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Review[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Review);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          saveBackup(LS_REVIEWS, list);
          callback(list);
        } else {
          callback(loadBackup<Review[]>(LS_REVIEWS, INITIAL_REVIEWS));
          INITIAL_REVIEWS.forEach(r => {
            setDoc(doc(db, REVIEWS_COL, r.id), r).catch(() => {});
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, REVIEWS_COL);
        callback(loadBackup<Review[]>(LS_REVIEWS, INITIAL_REVIEWS));
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, REVIEWS_COL);
    callback(loadBackup<Review[]>(LS_REVIEWS, INITIAL_REVIEWS));
    return () => {};
  }
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<string> {
  const id = review.id || ('rev-' + Date.now());
  const newReview: Review = {
    ...review,
    id,
    createdAt: review.createdAt || new Date().toISOString()
  };
  try {
    await setDoc(doc(db, REVIEWS_COL, id), newReview);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `${REVIEWS_COL}/${id}`);
  }
  const current = loadBackup<Review[]>(LS_REVIEWS, INITIAL_REVIEWS);
  saveBackup(LS_REVIEWS, [newReview, ...current]);
  return id;
}
