import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import RouteGuard from './RouteGuard';

const LoginPage = React.lazy(() => import('../page/login'));
const DashboardPage = React.lazy(() => import('../page/dashboard'));

interface RouteConfig {
    path: string;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
}

const generateRoutes = (): RouteConfig[] => {
    const routes: RouteConfig[] = [];
    const modules = import.meta.glob('../pages/**/index.tsx');

    for (const path in modules) {
        const routePath = path.replace('../pages', '').replace('/index.tsx', '') || '/';
        routes.push({
            path: routePath,
            component: React.lazy(modules[path] as () => Promise<{ default: React.ComponentType<any> }>),
        });
    }

    return routes;
};

const Router: React.FC = () => {
    const routes = generateRoutes();

    return (
        <BrowserRouter>
            <Suspense fallback={<Spin size="large" />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <RouteGuard guard={authGuard}>
                                <DashboardPage />
                            </RouteGuard>
                        }
                    >
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path.replace('/dashboard/', '')}
                                element={<route.component />}
                            />
                        ))}
                    </Route>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

const authGuard = (to: unknown, from: unknown, next: () => void): void => {
    debugger
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (isAuthenticated) {
        next();
    } else {
        window.location.href = '/login';
    }
};

export default Router;

