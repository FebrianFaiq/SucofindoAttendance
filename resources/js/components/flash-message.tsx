import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

interface FlashProps {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
}

export function FlashMessage() {
    const { flash } = usePage().props as unknown as FlashProps;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !message) return null;

    const isSuccess = type === 'success';

    return (
        <div
            className={`fixed top-[88px] right-8 z-50 flex items-start justify-between w-[380px] bg-white rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-neutral-100 p-4 animate-in slide-in-from-right-4 fade-in duration-300 ${
                isSuccess ? 'border-l-[6px] border-l-[#10B981]' : 'border-l-[6px] border-l-[#EF4444]'
            }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        isSuccess ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                    }`}
                >
                    {isSuccess ? (
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-[#1E293B] text-[15px]">
                        {isSuccess ? 'Berhasil' : 'Peringatan'}
                    </span>
                    <span className="text-[#64748B] text-[14px] font-medium mt-0.5 leading-snug">
                        {message}
                    </span>
                </div>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors ml-2"
                aria-label="Tutup notifikasi"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
