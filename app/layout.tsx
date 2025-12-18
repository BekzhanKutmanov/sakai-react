'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Импорт стилей
config.autoAddCss = false;
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

import '../styles/layout/openCourse.css';
import './globals.css';
import { useEffect } from 'react';

export function ClientLoader() {
    useEffect(() => {
        document.documentElement.classList.add('loaded');
    }, []);

    return null;
}

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    useEffect(() => {
        requestAnimationFrame(() => {
            document.documentElement.classList.add('loaded');
        });
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <ClientLoader />

                <div id="preloader">
                    <div id="preloader-area">
                        <div className="spinner"></div>
                        <div className="spinner"></div>
                        <div className="spinner"></div>
                        <div className="spinner"></div>
                        <div className="spinner"></div>
                        <div className="spinner"></div>
                    </div>
                    <div className="preloader-section preloader-left"></div>
                    <div className="preloader-section preloader-right"></div>
                </div>
                
                <PrimeReactProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
