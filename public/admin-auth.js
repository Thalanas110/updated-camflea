// Admin Authentication Module
// This script must be loaded before any admin functionality

// CRITICAL SECURITY: Immediately hide page content to prevent flash
(function() {
    const style = document.createElement('style');
    style.textContent = `
        body > *:not(#auth-loading-overlay):not(#auth-modal) { 
            display: none !important; 
        }
        #auth-loading-overlay { 
            display: flex !important; 
        }
    `;
    style.id = 'admin-security-style';
    document.head.appendChild(style);
})();

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
                this.showModal('Authentication Error', 'Failed to initialize authentication system.');
                this.redirectToLogin();
                return false;
            }

            // Check if user is logged in
            const { data: { user }, error: userError } = await this.supabase.auth.getUser();
            
            if (userError || !user) {
                console.log('No authenticated user found');
                this.showModal('Access Denied', 'You must be logged in to access this page.');
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
                this.showModal('Access Denied', 'User not found in system.');
                this.redirectToLogin();
                return false;
            }

            if (!studentData) {
                console.log('No student data found for user');
                this.showModal('Access Denied', 'User not found in system.');
                this.redirectToLogin();
                return false;
            }

            // Check if user has admin privileges (is_role should be 1 for admins)
            if (studentData.is_role !== 1) {
                console.log('User does not have admin privileges. is_role:', studentData.is_role);
                this.showModal('Access Denied', 'You do not have admin privileges.');
                this.redirectToLogin();
                return false;
            }

            console.log('Admin authentication successful for:', user.email);
            return true;
        } catch (error) {
            console.error('Authentication error:', error);
            this.showModal('Authentication Error', 'An error occurred during authentication.');
            this.redirectToLogin();
            return false;
        }
    }

    showModal(title, message) {
        // Create modal HTML
        const modalHTML = `
            <div id="auth-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    text-align: center;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: #ff4757;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                        color: white;
                        font-size: 24px;
                    ">
                        🚫
                    </div>
                    <h3 style="
                        margin: 0 0 15px 0;
                        color: #333;
                        font-size: 20px;
                        font-weight: 600;
                    ">${title}</h3>
                    <p style="
                        margin: 0 0 25px 0;
                        color: #666;
                        font-size: 16px;
                        line-height: 1.5;
                    ">${message}</p>
                    <button onclick="document.getElementById('auth-modal').remove()" style="
                        background: #069210;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background 0.2s ease;
                    " onmouseover="this.style.background='#057a1a'" onmouseout="this.style.background='#069210'">
                        OK
                    </button>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('auth-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    redirectToLogin() {
        // Add a small delay to show any error messages
        setTimeout(() => {
            window.location.href = 'Login_page.html';
        }, 1000);
    }

    async protectPage() {
        // Create opaque overlay with loading screen
        const loadingHTML = `
            <div id="auth-loading-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(6, 146, 16, 0.95);
                backdrop-filter: blur(10px);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    text-align: center;
                    color: white;
                    max-width: 400px;
                    padding: 40px;
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        border: 4px solid rgba(255, 255, 255, 0.3);
                        border-top: 4px solid white;
                        border-radius: 50%;
                        margin: 0 auto 30px;
                        animation: adminAuthSpin 1s linear infinite;
                    "></div>
                    <h2 style="
                        margin: 0 0 15px 0;
                        font-size: 24px;
                        font-weight: 600;
                        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    ">🔐 Admin Access Verification</h2>
                    <p style="
                        margin: 0 0 20px 0;
                        font-size: 16px;
                        opacity: 0.9;
                        line-height: 1.5;
                    ">Verifying your admin credentials...</p>
                    <div style="
                        display: flex;
                        justify-content: center;
                        gap: 8px;
                        margin-top: 20px;
                    ">
                        <div style="
                            width: 8px;
                            height: 8px;
                            background: white;
                            border-radius: 50%;
                            animation: adminAuthDot 1.4s ease-in-out infinite both;
                        "></div>
                        <div style="
                            width: 8px;
                            height: 8px;
                            background: white;
                            border-radius: 50%;
                            animation: adminAuthDot 1.4s ease-in-out 0.16s infinite both;
                        "></div>
                        <div style="
                            width: 8px;
                            height: 8px;
                            background: white;
                            border-radius: 50%;
                            animation: adminAuthDot 1.4s ease-in-out 0.32s infinite both;
                        "></div>
                    </div>
                </div>
            </div>
            <style>
                @keyframes adminAuthSpin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes adminAuthDot {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
        
        // Add loading overlay
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        
        // Disable page interaction
        document.body.style.overflow = 'hidden';

        // Initialize and check authentication
        const initialized = await this.initialize();
        if (!initialized) {
            this.removeLoadingOverlay();
            return false;
        }

        const isAuthenticated = await this.checkAuthentication();
        
        // Remove loading overlay
        this.removeLoadingOverlay();

        if (isAuthenticated) {
            // Authentication successful, show page
            this.showPage();
            return true;
        }
        
        return false;
    }

    showPage() {
        // Remove the security hiding style
        const securityStyle = document.getElementById('admin-security-style');
        if (securityStyle) {
            securityStyle.remove();
        }
        // Ensure page is visible
        document.body.style.overflow = 'auto';
    }

    removeLoadingOverlay() {
        const overlay = document.getElementById('auth-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }
        document.body.style.overflow = 'auto';
    }

    // Logout function
    async logout() {
        try {
            if (this.supabase) {
                // Sign out from Supabase auth
                const { error } = await this.supabase.auth.signOut();
                if (error) {
                    console.error('Supabase logout error:', error);
                }
            }
            
            // Clear all local storage and session storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear any cookies (if any)
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            
            // Clear any cached auth data
            if (window.supabase) {
                window.supabase = null;
            }
            
            console.log('Complete logout successful');
            
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Force redirect to login with cache busting
            window.location.href = 'Login_page.html?t=' + Date.now();
        }
    }
}

// Global instance
window.adminAuth = new AdminAuth();

// Auto-protect any page that includes this script
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await window.adminAuth.protectPage();
    
    if (isAuthenticated) {
        // Only show page if authenticated
        window.adminAuth.showPage();
        // Trigger custom event when authentication is complete
        document.dispatchEvent(new CustomEvent('adminAuthComplete'));
    }
    // If not authenticated, page stays hidden and user gets redirected
});
