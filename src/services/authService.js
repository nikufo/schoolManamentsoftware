import { supabase } from '../lib/supabase';

export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { success: false, error: error?.message, data: null };
    }
  },

  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'student'
          }
        }
      });

      if (error) {
        return { success: false, error: error?.message, data: null };
      }

      return { success: true, error: null, data };
    } catch (error) {
      return { success: false, error: error?.message, data: null };
    }
  },

  // Sign out current user
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase?.auth?.getSession();

      if (error) {
        return { success: false, error: error?.message, session: null };
      }

      return { success: true, error: null, session: data?.session };
    } catch (error) {
      return { success: false, error: error?.message, session: null };
    }
  },

  // Get current user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', userId)
        ?.single();

      if (error) {
        return { success: false, error: error?.message, profile: null };
      }

      return { success: true, error: null, profile: data };
    } catch (error) {
      return { success: false, error: error?.message, profile: null };
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update({ 
          ...updates, 
          updated_at: new Date()?.toISOString() 
        })
        ?.eq('id', userId)
        ?.select()
        ?.single();

      if (error) {
        return { success: false, error: error?.message, profile: null };
      }

      return { success: true, error: null, profile: data };
    } catch (error) {
      return { success: false, error: error?.message, profile: null };
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email, {
        redirectTo: `${window.location?.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }
};

export default authService;