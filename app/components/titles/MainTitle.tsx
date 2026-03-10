'use client';

export default function MainTitle({children}: {children: string}) {
    return (
        <h3 className={`text-xl sm:text-2xl font-bold mb-3 py-3 shadow-[var(--bottom-shadow)]`}>{children}</h3>
    );
};
