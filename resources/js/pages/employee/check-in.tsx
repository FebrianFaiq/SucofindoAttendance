import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Camera,
    MapPin,
    Fingerprint,
    Loader2,
    User,
    RefreshCw,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';

// ─── Types ─────────────────────────────────────────────────────────────────

interface CheckInProps {
    alreadyCheckedIn: boolean;
    todayAttendance: unknown;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getTodayFormatted(): string {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function CheckIn({ alreadyCheckedIn }: CheckInProps) {
    const page = usePage();

    // Live clock
    const [time, setTime] = useState(
        new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }),
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(
                new Date().toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }),
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Form state
    const { data, setData, post, processing, errors } = useForm<{
        type: string;
        photo: File | null;
        gps_lat: string;
        gps_lng: string;
    }>({
        type: 'WFO',
        photo: null,
        gps_lat: '',
        gps_lng: '',
    });

    // Photo capture
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Location
    const [locationAddress, setLocationAddress] = useState('Mendeteksi lokasi...');
    const [locationLoading, setLocationLoading] = useState(true);
    const [inRadius, setInRadius] = useState(false);

    // Get GPS location
    const fetchLocation = useCallback(() => {
        setLocationLoading(true);
        setLocationAddress('Mendeteksi lokasi...');
        
        if (!navigator.geolocation) {
            setLocationLoading(false);
            setLocationAddress('Browser tidak mendukung geolokasi.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setData((prev) => ({ ...prev, gps_lat: lat.toString(), gps_lng: lng.toString() }));
                setLocationLoading(false);
                setInRadius(true);
                
                // Fallback coordinates first
                setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
                
                // Fetch human-readable address
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.display_name) {
                            setLocationAddress(data.display_name);
                        }
                    }
                } catch (err) {
                    console.error("Reverse geocoding failed", err);
                }
            },
            (error) => {
                setLocationLoading(false);
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationAddress('Izin lokasi ditolak oleh browser.');
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    setLocationAddress('Informasi lokasi tidak tersedia.');
                } else if (error.code === error.TIMEOUT) {
                    setLocationAddress('Waktu permintaan lokasi habis.');
                } else {
                    setLocationAddress('Gagal mendeteksi lokasi.');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        );
    }, [setData]);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    // Camera functions
    const startCamera = useCallback(async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Browser Anda tidak mendukung akses kamera atau koneksi tidak aman (butuh HTTPS/localhost).');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 },
            });
            streamRef.current = stream;
            setCameraActive(true);
        } catch (error) {
            console.error('Camera error:', error);
            alert('Gagal mengakses kamera. Pastikan Anda telah memberikan izin (Allow) pada browser.');
        }
    }, []);

    // Attach stream to video element once it's rendered
    useEffect(() => {
        if (cameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [cameraActive]);

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'check-in-photo.jpg', {
                    type: 'image/jpeg',
                });
                setData('photo', file);
                setPhotoPreview(canvas.toDataURL('image/jpeg'));

                // Stop camera
                streamRef.current?.getTracks().forEach((t) => t.stop());
                setCameraActive(false);
            }
        }, 'image/jpeg', 0.8);
    }, [setData]);

    const retakePhoto = useCallback(() => {
        setPhotoPreview(null);
        setData('photo', null);
        startCamera();
    }, [setData, startCamera]);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    // Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/employee/check-in');
    };

    // Get all errors as array
    const allErrors = Object.values(errors).filter(Boolean);
    const pageErrors = page.props.errors as Record<string, string> | undefined;
    const serverErrors = pageErrors
        ? Object.values(pageErrors).filter(Boolean)
        : [];
    const combinedErrors = [...new Set([...allErrors, ...serverErrors])];

    if (alreadyCheckedIn) {
        return (
            <>
                <Head title="Check In" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6 bg-sucofindo-light">
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center max-w-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
                            <Fingerprint className="h-8 w-8 text-[#059669]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                            Anda sudah Check In hari ini
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280]">
                            Silakan kembali ke dashboard untuk melihat status kehadiran Anda.
                        </p>
                        <Link
                            href="/employee/dashboard"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#035EA9] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#024a87]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Check In" />
            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-6 p-6 bg-sucofindo-light">
                {/* Error display */}
                {combinedErrors.length > 0 && (
                    <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-4">
                        <ul className="list-inside list-disc text-sm text-[#DC2626]">
                            {combinedErrors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
                    {/* ── Left Column ──────────────────────────────────── */}
                    <div className="flex flex-col gap-6">
                        {/* Clock Card */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center">
                            <p className="text-5xl md:text-6xl font-extrabold text-[#035EA9] font-['Mulish',sans-serif] tracking-tight">
                                {time}
                            </p>
                            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[#6B7280]">
                                <Calendar className="h-4 w-4" />
                                {getTodayFormatted()}
                            </div>
                        </div>

                        {/* Mode Kerja Card */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                            <h3 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif] mb-4">
                                Pilihan Mode Kerja
                            </h3>
                            <div className="flex rounded-lg bg-[#F3F4F6] p-1">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'WFO')}
                                    className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                                        data.type === 'WFO'
                                            ? 'bg-[#035EA9] text-white shadow-sm'
                                            : 'text-[#6B7280] hover:text-[#14141A]'
                                    }`}
                                >
                                    WFO
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'WFA')}
                                    className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                                        data.type === 'WFA'
                                            ? 'bg-[#035EA9] text-white shadow-sm'
                                            : 'text-[#6B7280] hover:text-[#14141A]'
                                    }`}
                                >
                                    WFA
                                </button>
                            </div>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        {/* Lokasi Card */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                            <h3 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif] mb-4">
                                Lokasi Saat Ini
                            </h3>

                            {/* Map placeholder */}
                            <div className="relative mb-4 h-40 overflow-hidden rounded-xl bg-[#EFF6FF]">
                                {data.gps_lat && data.gps_lng ? (
                                    <iframe
                                        title="Map Location"
                                        className="h-full w-full border-0"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(data.gps_lng) - 0.005}%2C${Number(data.gps_lat) - 0.003}%2C${Number(data.gps_lng) + 0.005}%2C${Number(data.gps_lat) + 0.003}&layer=mapnik&marker=${data.gps_lat}%2C${data.gps_lng}`}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <MapPin className="h-8 w-8 text-[#035EA9]/40" />
                                            <p className="text-xs text-[#9CA3AF]">
                                                {locationLoading ? 'Mendeteksi lokasi...' : 'Lokasi tidak tersedia'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location info */}
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#035EA9]" />
                                <div className="flex-1">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                        Lokasi Terdeteksi
                                    </p>
                                    <p className="text-sm font-semibold text-[#14141A] leading-tight mt-0.5 line-clamp-2">
                                        {locationAddress}
                                    </p>
                                    
                                    {(!data.gps_lat || !data.gps_lng) && !locationLoading && (
                                        <button
                                            type="button"
                                            onClick={fetchLocation}
                                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#035EA9] hover:underline cursor-pointer"
                                        >
                                            <RefreshCw className="h-3 w-3" />
                                            Coba Lagi
                                        </button>
                                    )}
                                </div>
                            </div>

                            {inRadius && (
                                <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#059669]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                                        DALAM RADIUS
                                    </span>
                                </div>
                            )}
                            <InputError message={errors.gps_lat} className="mt-2" />
                        </div>
                    </div>

                    {/* ── Right Column ──────────────────────────────────── */}
                    <div className="flex flex-col gap-6">
                        {/* Verifikasi Wajah Card */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 flex-1 flex flex-col">
                            <h3 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif] mb-4">
                                Verifikasi Wajah
                            </h3>

                            <div className="relative flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#035EA9]/20 bg-[#EFF6FF] overflow-hidden min-h-[350px]">
                                {photoPreview ? (
                                    /* Photo preview */
                                    <>
                                        <img
                                            src={photoPreview}
                                            alt="Foto Check In"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-black/60 to-transparent">
                                            <p className="mb-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-[#10B981] shadow-sm">
                                                ✓ Foto berhasil diambil
                                            </p>
                                            <button
                                                type="button"
                                                onClick={retakePhoto}
                                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#14141A] shadow-lg transition-colors hover:bg-gray-100"
                                            >
                                                <Camera className="h-4 w-4" />
                                                Ambil Ulang
                                            </button>
                                        </div>
                                    </>
                                ) : cameraActive ? (
                                    /* Camera stream */
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        {/* Overlay mask for face positioning */}
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                            <div 
                                                className="h-64 w-64 rounded-full border-2 border-white/60" 
                                                style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} 
                                            />
                                        </div>
                                        {/* Bottom Action */}
                                        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                            <button
                                                type="button"
                                                onClick={capturePhoto}
                                                className="relative z-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#035EA9] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#024a87]"
                                            >
                                                <Camera className="h-5 w-5" />
                                                AMBIL FOTO
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* Initial state */
                                    <div className="relative z-10 flex flex-col items-center gap-4 p-6">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-sm">
                                            <User className="h-12 w-12 text-[#9CA3AF]" />
                                        </div>
                                        <p className="max-w-[260px] text-center text-sm text-[#6B7280]">
                                            Posisikan wajah Anda di dalam bingkai untuk
                                            verifikasi biometrik otomatis.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#035EA9] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#024a87]"
                                        >
                                            <Camera className="h-4 w-4" />
                                            BUKA KAMERA
                                        </button>
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.photo} className="mt-2" />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || !data.photo || !data.gps_lat}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#035EA9] py-4 text-sm font-semibold text-white transition-all hover:bg-[#024a87] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Fingerprint className="h-5 w-5" />
                            )}
                            {processing ? 'Memproses...' : 'Konfirmasi Clock In'}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

CheckIn.layout = () => ({
    breadcrumbs: [
        { title: 'Absensi', href: '/employee/dashboard' },
        { title: 'Check In', href: '/employee/check-in' },
    ],
});
