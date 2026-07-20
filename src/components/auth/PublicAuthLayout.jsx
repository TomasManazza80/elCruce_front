import React from 'react';
import { Header } from '../public/header';

export function PublicAuthLayout({ children }) {
    return (
        <div className="theme-public dark min-h-screen relative flex items-center justify-center bg-black text-foreground font-sans selection:bg-[#b91c1c]/30 selection:text-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero-property.jpg"
                    alt="Background"
                    className="w-full h-full object-cover object-center opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Header/Logo Overlay */}
            <Header />

            {/* Content (Card) */}
            <main className="relative z-10 w-full max-w-md px-4 mt-24 md:mt-16">
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#b91c1c]/30">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default PublicAuthLayout;
