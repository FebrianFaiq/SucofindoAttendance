import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Loader2,
    LogIn as LogInIcon,
    LogOut as LogOutIcon,
    Camera,
    MapPin,
    RefreshCw,
    User,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import InputError from '@/components/input-error';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Constants for Radius
const SUCOFINDO_LAT = -7.254776;
const SUCOFINDO_LNG = 112.717212;
const RADIUS_LIMIT = 200; // in meters

// Haversine formula to calculate distance between two coordinates in meters
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface CheckOutProps {
    hasCheckedIn: boolean;
    alreadyCheckedOut: boolean;
    todayAttendance: {
        id: number;
        type: string;
        check_in_at: string;
        check_out_at: string | null;
    } | null;
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

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);

    return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

function calculateDuration(checkInStr: string): string {
    const checkIn = new Date(checkInStr);
    const now = new Date();
    const diffMs = now.getTime() - checkIn.getTime();
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}j ${minutes}m`;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function CheckOut({
    hasCheckedIn,
    alreadyCheckedOut,
    todayAttendance,
}: CheckOutProps) {
    const page = usePage();

    // Live clock
    const [time, setTime] = useState(
        new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }),
    );

    // Live duration
    const [duration, setDuration] = useState(
        todayAttendance?.check_in_at
            ? calculateDuration(todayAttendance.check_in_at)
            : '0j 0m',
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

            if (todayAttendance?.check_in_at) {
                setDuration(calculateDuration(todayAttendance.check_in_at));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [todayAttendance]);

    // Form
    const { data, setData, post, processing, errors } = useForm<{
        work_notes: string;
        photo: File | null;
        gps_lat: string;
        gps_lng: string;
    }>({
        work_notes: '',
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
                
                // Calculate distance
                const distance = getDistance(lat, lng, SUCOFINDO_LAT, SUCOFINDO_LNG);
                setInRadius(distance <= RADIUS_LIMIT);
                
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
        if (!hasCheckedIn || alreadyCheckedOut) {
return;
}

        fetchLocation();
    }, [fetchLocation, hasCheckedIn, alreadyCheckedOut]);

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
        if (!videoRef.current || !canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'check-out-photo.jpg', {
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
        post('/employee/check-out', { forceFormData: true });
    };

    // Errors
    const allErrors = Object.values(errors).filter(Boolean);
    const pageErrors = page.props.errors as Record<string, string> | undefined;
    const serverErrors = pageErrors
        ? Object.values(pageErrors).filter(Boolean)
        : [];
    const combinedErrors = [...new Set([...allErrors, ...serverErrors])];

    // Guard: belum check-in
    if (!hasCheckedIn) {
        return (
            <>
                <Head title="Check Out" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6 bg-sucofindo-light">
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center max-w-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3C7]">
                            <LogInIcon className="h-8 w-8 text-[#D97706]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                            Anda belum Check In
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280]">
                            Silakan lakukan Check In terlebih dahulu sebelum melakukan Check Out.
                        </p>
                        <Link
                            href="/employee/check-in"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#035EA9] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#024a87]"
                        >
                            <LogInIcon className="h-4 w-4" />
                            Check In Sekarang
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Guard: sudah check-out
    if (alreadyCheckedOut) {
        return (
            <>
                <Head title="Check Out" />
                <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-6 bg-sucofindo-light">
                    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center max-w-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5]">
                            <LogOutIcon className="h-8 w-8 text-[#059669]" />
                        </div>
                        <h2 className="text-xl font-bold text-[#14141A] font-['Mulish',sans-serif]">
                            Anda sudah Check Out hari ini
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280]">
                            Silakan kembali ke dashboard untuk melihat ringkasan kehadiran Anda.
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

    const clockInTime = todayAttendance?.check_in_at
        ? formatTime(todayAttendance.check_in_at)
        : '--:--';

    return (
        <>
            <Head title="Check Out" />
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

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
                    
                    {/* ── Left Column ──────────────────────────────────── */}
                    <div className="flex flex-col gap-6">
                        
                        {/* Clock Out & Summary Card */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Link
                                    href="/employee/dashboard"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#14141A]"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <h2 className="text-lg font-bold text-[#14141A] font-['Mulish',sans-serif]">
                                    Clock Out
                                </h2>
                            </div>

                            <div className="text-center mb-6">
                                <p className="text-5xl md:text-6xl font-extrabold text-[#035EA9] font-['Mulish',sans-serif] tracking-tight">
                                    {time}
                                </p>
                                <p className="mt-2 text-sm text-[#6B7280]">
                                    {getTodayFormatted()}
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
                                <div className="grid grid-cols-2 divide-x divide-[#E5E7EB]">
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">
                                            Clock In
                                        </p>
                                        <div className="flex items-center justify-center gap-2">
                                            <LogInIcon className="h-4 w-4 text-[#6B7280]" />
                                            <span className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif]">
                                                {clockInTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1">
                                            Durasi Kerja
                                        </p>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-base font-bold text-[#035EA9] font-['Mulish',sans-serif]">
                                                {duration}
                                            </span>
                                            <Clock className="h-4 w-4 text-[#035EA9]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lokasi Card */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                            <h3 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif] mb-4">
                                Lokasi Saat Ini
                            </h3>

                            <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-[#EFF6FF] border border-[#E5E7EB]">
                                {data.gps_lat && data.gps_lng ? (
                                    <MapContainer 
                                        center={[Number(data.gps_lat), Number(data.gps_lng)]} 
                                        zoom={16} 
                                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                        />
                                        <Marker position={[Number(data.gps_lat), Number(data.gps_lng)]}>
                                            <Popup>Lokasi Anda</Popup>
                                        </Marker>
                                        <Circle 
                                            center={[SUCOFINDO_LAT, SUCOFINDO_LNG]} 
                                            radius={RADIUS_LIMIT} 
                                            pathOptions={{ color: '#035EA9', fillColor: '#035EA9', fillOpacity: 0.1 }} 
                                        />
                                        <Marker position={[SUCOFINDO_LAT, SUCOFINDO_LNG]}>
                                            <Popup>Graha Sucofindo</Popup>
                                        </Marker>
                                    </MapContainer>
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

                            {data.gps_lat && todayAttendance?.type === 'WFO' && (
                                <div className="mt-3">
                                    {inRadius ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#059669]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                                            DALAM RADIUS
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                                            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                            LUAR RADIUS KANTOR
                                        </span>
                                    )}
                                </div>
                            )}
                            {todayAttendance?.type === 'WFA' && (
                                <div className="mt-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-[#035EA9]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#035EA9]" />
                                        BEBAS RADIUS (WFA)
                                    </span>
                                </div>
                            )}
                            <InputError message={errors.gps_lat} className="mt-2" />
                        </div>
                    </div>

                    {/* ── Right Column ──────────────────────────────────── */}
                    <div className="flex flex-col gap-6">
                        {/* Verifikasi Wajah Card */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 flex flex-col">
                            <h3 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif] mb-4">
                                Verifikasi Wajah
                            </h3>

                            <div className="relative flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#035EA9]/20 bg-[#EFF6FF] overflow-hidden min-h-[350px]">
                                {photoPreview ? (
                                    <>
                                        <img
                                            src={photoPreview}
                                            alt="Foto Check Out"
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
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                            <div 
                                                className="h-64 w-64 rounded-full border-2 border-white/60" 
                                                style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} 
                                            />
                                        </div>
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

                        {/* Catatan Pekerjaan */}
                        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
                            <h3 className="text-base font-bold text-[#14141A] font-['Mulish',sans-serif] mb-3">
                                Catatan Pekerjaan
                            </h3>
                            <textarea
                                value={data.work_notes}
                                onChange={(e) => setData('work_notes', e.target.value)}
                                placeholder="Ceritakan pekerjaan atau aktivitas yang Anda lakukan hari ini..."
                                rows={4}
                                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#14141A] placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-[#035EA9] focus:ring-2 focus:ring-[#035EA9]/20 focus:bg-white resize-none"
                            />
                            <InputError message={errors.work_notes} className="mt-2" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || !data.photo || !data.gps_lat || !data.work_notes.trim() || (todayAttendance?.type === 'WFO' && !inRadius)}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#035EA9] py-4 text-sm font-semibold text-white transition-all hover:bg-[#024a87] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                        >
                            {processing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <LogOutIcon className="h-5 w-5" />
                            )}
                            {processing ? 'Memproses...' : (todayAttendance?.type === 'WFO' && !inRadius && data.gps_lat ? 'Luar Radius (Tidak Bisa Check Out)' : 'Konfirmasi Clock Out')}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

CheckOut.layout = () => ({
    breadcrumbs: [
        { title: 'Absensi', href: '/employee/dashboard' },
        { title: 'Check Out', href: '/employee/check-out' },
    ],
});
