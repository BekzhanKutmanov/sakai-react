'use client';

import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    if (!ready) {
        return (
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
        );
    }

    return <>{children}</>;
}
