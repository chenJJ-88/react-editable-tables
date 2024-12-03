import { lazy } from 'react';

interface RouteConfig {
    path: string;
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    guard?: (to: any, from: any, next: () => void) => void;
}

export function generateRoutes(context: __WebpackModuleApi.RequireContext): RouteConfig[] {
    const routes: RouteConfig[] = [];

    context.keys().forEach((key:any) => {
        if (key.includes('index.tsx')) {
            const path = key.replace(/^\.\/|\/index\.tsx$/g, '');
            const component = lazy(() => import(`../pages/${path}`));
            const route: RouteConfig = { path: `/${path}`, component };

            // Check if there's a guard file in the same directory
            try {
                const guard = require(`../pages/${path}/guard.ts`).default;
                if (typeof guard === 'function') {
                    route.guard = guard;
                }
            } catch (e) {
                // No guard file found, continue without it
            }

            routes.push(route);
        }
    });

    return routes;
}

