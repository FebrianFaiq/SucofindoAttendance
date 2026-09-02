import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

/**
 * Auth layout khas SUCOFINDO — split layout:
 * - Kiri:  gambar gedung Graha Sucofindo (rounded corners)
 * - Kanan: form login di dalam card putih
 *
 * Background: lavender/light blue (#F0F0FA) — turunan dari --color-sucofindo-light
 */
export default function AuthSucofindoLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-sucofindo-light bg-gradient-to-br from-sucofindo-light to-[#E5E7EB] p-4 md:p-8 lg:p-12 relative overflow-hidden">
            {/* Background Accent Shapes */}
            <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-300/30 blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex w-full max-w-[1050px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.12)] border border-white/60"
            >
                {/* ─── Kiri: Gambar Gedung ─── */}
                <div className="relative hidden w-1/2 lg:block overflow-hidden bg-sucofindo-dark">
                    <motion.img
                        initial={{ scale: 1.15 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.8, ease: 'easeOut' }}
                        src="/images/graha-sucofindo.png"
                        alt="Graha Sucofindo"
                        className="h-full w-full object-cover"
                    />
                    {/* Premium Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-sucofindo-blue/80 via-sucofindo-primary/50 to-transparent mix-blend-multiply" />
                    
                    {/* Overlay Text */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                        className="absolute bottom-12 left-10 right-10 text-white"
                    >
                        <h2 className="text-[28px] font-extrabold mb-3 font-mulish leading-tight drop-shadow-md">
                            Ensuring Quality Protecting Trust
                        </h2>
                    </motion.div>
                </div>

                {/* ─── Kanan: Form Area ─── */}
                <div className="flex w-full flex-col items-center justify-center px-8 py-16 sm:px-12 lg:w-1/2 lg:px-20 bg-white">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
