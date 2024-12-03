export default function dashboardGuard(to: any, from: any, next: () => void) {
    // Example guard logic
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (isAuthenticated) {
        next();
    } else {
        // Redirect to login if not authenticated
        window.location.href = '/login';
    }
}

