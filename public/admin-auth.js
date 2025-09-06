// Admin Authentication Module
// This script must be loaded before any admin functionality

class AdminAuth {
    constructor() {
        this.supabaseUrl = 'https://wuhgqjeijmxsgvnykttj.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGdxamVpam14c2d2bnlrdHRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTMwNCwiZXhwIjoyMDU4NDA1MzA0fQ.z25Bc1YxdBjWo5b9ezMW7noMSTehSNzTtzOCLFNm-o4';
    }

    async initialize() {
        try {
            // Import Supabase dynamically
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
            this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
            return true;
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            return false;
        }
    }

    async checkAuthentication() {
        try {
            if (!this.supabase) {
                console.error('Supabase not initialized');
                this.redirectToLogin();
                return false;
            }

            // Check if user is logged in
            const { data: { user }, error: userError } = await this.supabase.auth.getUser();
            
            if (userError || !user) {
                console.log('No authenticated user found');
                this.redirectToLogin();
                return false;
            }

            console.log('User found:', user.email);

            // Check if user has admin privileges in the database
            const { data: studentData, error: studentError } = await this.supabase
                .from('student')
                .select('is_role, stud_email')
                .eq('stud_email', user.email)
                .single();

            if (studentError) {
                console.log('Error fetching user role:', studentError);
                // If user not found in student table, deny access
                alert('Access denied. User not found in system.');
                this.redirectToLogin();
                return false;
            }

            if (!studentData) {
                console.log('No student data found for user');
                alert('Access denied. User not found in system.');
                this.redirectToLogin();
                return false;
            }

            // Check if user has admin privileges (is_role should be 1 for admins)
            if (studentData.is_role !== 1) {
                console.log('User does not have admin privileges. is_role:', studentData.is_role);
                alert('Access denied. You do not have admin privileges.');
                this.redirectToLogin();
                return false;
            }

            console.log('Admin authentication successful for:', user.email);
            return true;
        } catch (error) {
            console.error('Authentication error:', error);
            this.redirectToLogin();
            return false;
        }
    }

    redirectToLogin() {
        // Add a small delay to show any error messages
        setTimeout(() => {
            window.location.href = 'Login_page.html';
        }, 1000);
    }

    async protectPage() {
        // Show loading state
        document.body.style.opacity = '0.5';
        document.body.style.pointerEvents = 'none';
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'auth-loading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(6, 146, 16, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
            font-family: 'Inter', sans-serif;
        `;
        loadingDiv.innerHTML = `
            <div style="margin-bottom: 10px;">🔒</div>
            <div>Verifying admin access...</div>
        `;
        document.body.appendChild(loadingDiv);

        // Initialize and check authentication
        const initialized = await this.initialize();
        if (!initialized) {
            return false;
        }

        const isAuthenticated = await this.checkAuthentication();
        
        // Remove loading indicator
        const authLoading = document.getElementById('auth-loading');
        if (authLoading) {
            authLoading.remove();
        }

        if (isAuthenticated) {
            // Authentication successful, show page
            document.body.style.opacity = '1';
            document.body.style.pointerEvents = 'auto';
            return true;
        }
        
        return false;
    }

    // Logout function
    async logout() {
        try {
            if (this.supabase) {
                await this.supabase.auth.signOut();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            window.location.href = 'Login_page.html';
        }
    }
}

// Global instance
window.adminAuth = new AdminAuth();

// Auto-protect any page that includes this script
document.addEventListener('DOMContentLoaded', async () => {
    await window.adminAuth.protectPage();
    
    // Trigger custom event when authentication is complete
    document.dispatchEvent(new CustomEvent('adminAuthComplete'));
});
