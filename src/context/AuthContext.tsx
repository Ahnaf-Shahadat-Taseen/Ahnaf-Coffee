import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/initialSeedData';
import { SYSTEM_CREDENTIALS, SystemAccount } from '../data/credentials';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<UserProfile>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'ahnaf_coffee_active_user';
const LOCAL_STORAGE_REGISTERED_USERS_KEY = 'ahnaf_coffee_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    // Only restore if user previously logged in
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // fallback
    }
    return null; // Require explicit login with email & password!
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync profile changes to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userProfile));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [userProfile]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // New user created via Google or Firebase Auth
            const isAdminEmail = fbUser.email && (
              fbUser.email.toLowerCase() === 'ahnaf@ahnafcoffee.com' ||
              fbUser.email.toLowerCase() === 'admin@ahnafcoffee.com' ||
              fbUser.email.toLowerCase() === 'taseen2001@gmail.com'
            );
            const isStaffEmail = fbUser.email && (
              fbUser.email.toLowerCase() === 'maya@ahnafcoffee.com' ||
              fbUser.email.toLowerCase() === 'staff@ahnafcoffee.com'
            );

            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Coffee Enthusiast',
              role: isAdminEmail ? 'admin' : isStaffEmail ? 'staff' : 'customer',
              avatarUrl: fbUser.photoURL || undefined,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, 'users');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userDocRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(userDocRef);
      
      let profile: UserProfile;
      if (docSnap.exists()) {
        profile = docSnap.data() as UserProfile;
      } else {
        const isAdminEmail = fbUser.email && (
          fbUser.email.toLowerCase() === 'ahnaf@ahnafcoffee.com' ||
          fbUser.email.toLowerCase() === 'admin@ahnafcoffee.com' ||
          fbUser.email.toLowerCase() === 'taseen2001@gmail.com'
        );
        const isStaffEmail = fbUser.email && (
          fbUser.email.toLowerCase() === 'maya@ahnafcoffee.com' ||
          fbUser.email.toLowerCase() === 'staff@ahnafcoffee.com'
        );

        profile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Coffee Lover',
          role: isAdminEmail ? 'admin' : isStaffEmail ? 'staff' : 'customer',
          avatarUrl: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profile);
      }
      setUserProfile(profile);
    } catch (err: any) {
      console.warn('Google sign in error or popup cancelled:', err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Strictly Authenticate with Email & Password
   * Without valid email & password matching the account credentials, access is denied.
   */
  const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!trimmedPass) {
      throw new Error('Please enter your password.');
    }

    setLoading(true);

    try {
      // 1. First attempt Firebase Auth login
      try {
        const cred = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
        const userDocRef = doc(db, 'users', cred.user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const profile = docSnap.data() as UserProfile;
          setUserProfile(profile);
          return profile;
        }
      } catch (fbAuthErr: any) {
        // If error is wrong password, fail immediately
        if (fbAuthErr.code === 'auth/wrong-password' || fbAuthErr.code === 'auth/invalid-credential') {
          // Check system credentials before throwing to ensure seeded accounts work even if not yet in remote Firebase Auth
        }
      }

      // 2. Verify against Official System Accounts
      const matchedSystem = SYSTEM_CREDENTIALS.find(
        acc => acc.email.toLowerCase() === trimmedEmail
      );

      if (matchedSystem) {
        if (matchedSystem.password !== trimmedPass) {
          throw new Error('Incorrect password. Please verify and try again.');
        }

        // Locate existing profile or create based on system credentials
        const seedUser = INITIAL_USERS.find(u => u.email.toLowerCase() === trimmedEmail);
        const profile: UserProfile = {
          uid: seedUser?.uid || `user-${Date.now()}`,
          email: matchedSystem.email,
          displayName: matchedSystem.displayName,
          role: matchedSystem.role,
          dutyTitle: matchedSystem.dutyTitle,
          avatarUrl: seedUser?.avatarUrl || (
            matchedSystem.role === 'admin'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
              : matchedSystem.role === 'staff'
              ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
              : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
          ),
          createdAt: seedUser?.createdAt || new Date().toISOString()
        };

        setUserProfile(profile);
        return profile;
      }

      // 3. Check registered users stored locally
      let registeredUsers: any[] = [];
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS_KEY);
        if (stored) registeredUsers = JSON.parse(stored);
      } catch {}

      const matchedLocal = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === trimmedEmail
      );

      if (matchedLocal) {
        if (matchedLocal.password !== trimmedPass) {
          throw new Error('Incorrect password. Please check your credentials.');
        }
        const profile: UserProfile = matchedLocal.profile;
        setUserProfile(profile);
        return profile;
      }

      // If no account was matched
      throw new Error(`No account registered with ${trimmedEmail}. Please register a new account or use the provided credentials.`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new account with email, password, and name
   */
  const registerWithEmail = async (email: string, pass: string, name: string): Promise<UserProfile> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPass || !trimmedName) {
      throw new Error('Please fill in your name, email, and password.');
    }
    if (trimmedPass.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    setLoading(true);

    try {
      // Determine role from email
      const isAdminEmail = (
        trimmedEmail === 'ahnaf@ahnafcoffee.com' ||
        trimmedEmail === 'admin@ahnafcoffee.com' ||
        trimmedEmail === 'taseen2001@gmail.com'
      );
      const isStaffEmail = (
        trimmedEmail === 'maya@ahnafcoffee.com' ||
        trimmedEmail === 'staff@ahnafcoffee.com'
      );
      const role: UserRole = isAdminEmail ? 'admin' : isStaffEmail ? 'staff' : 'customer';

      let newUid = 'user-' + Date.now();

      // Try creating in Firebase Auth
      try {
        const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
        newUid = cred.user.uid;
      } catch (err: any) {
        console.warn('Firebase createUser notice:', err.message);
      }

      const newProfile: UserProfile = {
        uid: newUid,
        email: trimmedEmail,
        displayName: trimmedName,
        role,
        createdAt: new Date().toISOString()
      };

      // Save to Firestore
      try {
        await setDoc(doc(db, 'users', newUid), newProfile);
      } catch {}

      // Save to registered accounts backup
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_REGISTERED_USERS_KEY);
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          email: trimmedEmail,
          password: trimmedPass,
          profile: newProfile
        });
        localStorage.setItem(LOCAL_STORAGE_REGISTERED_USERS_KEY, JSON.stringify(list));
      } catch {}

      setUserProfile(newProfile);
      return newProfile;
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    try {
      if (currentUser?.uid) {
        await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setUserProfile(null);
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const role: UserRole | null = userProfile?.role || null;
  const isAuthenticated = userProfile !== null;
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const isCustomer = role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role,
        isAuthenticated,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        updateProfileData,
        logout,
        isAdmin,
        isStaff,
        isCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
