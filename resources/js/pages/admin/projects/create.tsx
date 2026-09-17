import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Save, FileText, Calculator, MapPin, Crosshair } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ProjectsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        description: '',
        start_date: '',
        end_date: '',
        is_active: true,
        site_latitude: '',
        site_longitude: '',
        site_radius: '200',
    });

    const [locationLoading, setLocationLoading] = useState(false);

    const handleGetLocation = () => {
        setLocationLoading(true);
        if (!navigator.geolocation) {
            alert('Browser tidak mendukung geolokasi.');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData(prev => ({
                    ...prev,
                    site_latitude: position.coords.latitude.toString(),
                    site_longitude: position.coords.longitude.toString()
                }));
                setLocationLoading(false);
            },
            (error) => {
                alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.');
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/projects');
    };

    // Calculate duration in days if both dates are selected
    const getDurationText = () => {
        if (!data.start_date || !data.end_date) {
            return 'Pilih tanggal mulai dan selesai untuk menghitung durasi.';
        }
        
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        
        if (end < start) {
            return 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.';
        }
        
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
        
        return `${diffDays} Hari`;
    };

    return (
        <>
            <Head title="Tambah Proyek" />
            <div className="flex h-full flex-1 flex-col bg-[#F9F9FF] p-8 font-mulish">
                
                {/* ── Header ────────────────────────────────────────── */}
                <div className="mb-6 flex flex-col">
                    <h1 className="text-[32px] font-extrabold text-[#14141A] tracking-tight">
                        Tambah Proyek Baru
                    </h1>
                    <p className="text-neutral-500 font-medium text-[15px] mt-1">
                        Masukkan detail proyek untuk pelacakan jam kerja dan kehadiran.
                    </p>
                </div>

                {/* ── Form Card ─────────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white flex flex-col w-full shadow-sm">
                    <div className="p-8 flex flex-col gap-6">
                        
                        {/* Section Header */}
                        <div className="flex items-center gap-3 border-b border-transparent pb-2">
                            <FileText className="h-6 w-6 text-[#035EA9]" />
                            <h2 className="text-[20px] font-bold text-[#14141A]">Informasi Proyek</h2>
                        </div>
                        
                        {/* Grid Form Fields */}
                        <div className="flex flex-col gap-6">
                            
                            {/* Row 1: Nama Proyek */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#14141A]">
                                    Nama Proyek
                                </label>
                                <Input 
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Masukkan nama proyek" 
                                    className="h-11 bg-white border-neutral-200 text-[#14141A] font-medium focus-visible:ring-[#035EA9]"
                                />
                                {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                            </div>
                            
                            {/* Row 2: Kode & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#14141A]">
                                        Kode Proyek
                                    </label>
                                    <Input 
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        placeholder="Contoh: PRJ-2023-001" 
                                        className="h-11 bg-white border-neutral-200 text-[#14141A] font-medium focus-visible:ring-[#035EA9]"
                                    />
                                    {errors.code && <p className="text-xs text-red-500 font-semibold">{errors.code}</p>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#14141A]">
                                        Status
                                    </label>
                                    <select
                                        value={data.is_active ? "1" : "0"}
                                        onChange={(e) => setData('is_active', e.target.value === "1")}
                                        className="h-11 w-full rounded-md border border-neutral-200 bg-white px-3 font-medium text-[#14141A] shadow-sm focus:border-[#035EA9] focus:outline-none focus:ring-1 focus:ring-[#035EA9]"
                                    >
                                        <option value="1">Aktif</option>
                                        <option value="0">Tidak Aktif</option>
                                    </select>
                                    {errors.is_active && <p className="text-xs text-red-500 font-semibold">{errors.is_active}</p>}
                                </div>
                            </div>

                            {/* Row 3: Tanggal Mulai & Selesai */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#14141A]">
                                        Tanggal Mulai
                                    </label>
                                    <DatePicker 
                                        date={data.start_date ? new Date(data.start_date) : undefined}
                                        setDate={(date) => setData('start_date', date ? format(date, 'yyyy-MM-dd') : '')}
                                        placeholder="mm/dd/yyyy"
                                        className="w-full h-11 border-neutral-200 bg-white shadow-sm hover:bg-neutral-50"
                                    />
                                    {errors.start_date && <p className="text-xs text-red-500 font-semibold">{errors.start_date}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-bold text-[#14141A]">
                                        Tanggal Selesai (Estimasi)
                                    </label>
                                    <DatePicker 
                                        date={data.end_date ? new Date(data.end_date) : undefined}
                                        setDate={(date) => setData('end_date', date ? format(date, 'yyyy-MM-dd') : '')}
                                        placeholder="mm/dd/yyyy"
                                        className="w-full h-11 border-neutral-200 bg-white shadow-sm hover:bg-neutral-50"
                                    />
                                    {errors.end_date && <p className="text-xs text-red-500 font-semibold">{errors.end_date}</p>}
                                </div>
                            </div>

                            {/* Row 4: Estimasi Durasi Proyek (Disabled/Calculated) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#14141A]">
                                    Estimasi Durasi Proyek
                                </label>
                                <div className="relative">
                                    <Input 
                                        value={getDurationText()}
                                        disabled
                                        className="h-11 bg-[#F8FAFC] border-neutral-200 border-dashed text-[#035EA9] font-semibold opacity-100 pr-10"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <Calculator className="h-5 w-5 text-neutral-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 5: Deskripsi Singkat */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#14141A]">
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Tambahkan catatan atau deskripsi proyek..."
                                    className="w-full min-h-[100px] p-3 bg-white border border-neutral-200 rounded-md text-[#14141A] font-medium focus:outline-none focus:ring-1 focus:ring-[#035EA9] focus:border-[#035EA9]"
                                />
                                {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description}</p>}
                            </div>

                        </div>

                        {/* Separator */}
                        <div className="h-[1px] w-full bg-neutral-200 mt-4 mb-2"></div>

                        {/* ── Section: Lokasi Site (Opsional) ── */}
                        <div className="flex items-center gap-3 border-b border-transparent pb-2 mt-2">
                            <MapPin className="h-6 w-6 text-[#035EA9]" />
                            <h2 className="text-[20px] font-bold text-[#14141A]">Lokasi Site (Radius WFO)</h2>
                        </div>
                        
                        <div className="text-sm text-neutral-500 font-medium mb-2">
                            Opsional. Jika diisi, pegawai yang bertugas di proyek ini akan menggunakan koordinat ini untuk validasi radius kehadiran (WFO). Jika dikosongkan, pegawai akan menggunakan lokasi default (Kantor Surabaya).
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#14141A]">Latitude</label>
                                <Input 
                                    type="number" step="any"
                                    value={data.site_latitude}
                                    onChange={(e) => setData('site_latitude', e.target.value)}
                                    placeholder="-7.254776" 
                                    className="h-11 border-neutral-200"
                                />
                                {errors.site_latitude && <p className="text-xs text-red-500 font-semibold">{errors.site_latitude}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#14141A]">Longitude</label>
                                <Input 
                                    type="number" step="any"
                                    value={data.site_longitude}
                                    onChange={(e) => setData('site_longitude', e.target.value)}
                                    placeholder="112.717212" 
                                    className="h-11 border-neutral-200"
                                />
                                {errors.site_longitude && <p className="text-xs text-red-500 font-semibold">{errors.site_longitude}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-bold text-[#14141A]">Radius (Meter)</label>
                                <Input 
                                    type="number"
                                    value={data.site_radius}
                                    onChange={(e) => setData('site_radius', e.target.value)}
                                    placeholder="200" 
                                    className="h-11 border-neutral-200"
                                />
                                {errors.site_radius && <p className="text-xs text-red-500 font-semibold">{errors.site_radius}</p>}
                            </div>
                        </div>

                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleGetLocation}
                            disabled={locationLoading}
                            className="w-fit gap-2 border-[#035EA9] text-[#035EA9] hover:bg-[#F2F8FD]"
                        >
                            <Crosshair className="h-4 w-4" />
                            {locationLoading ? 'Mendeteksi...' : 'Gunakan Lokasi Saat Ini'}
                        </Button>

                        {data.site_latitude && data.site_longitude && (
                            <div className="mt-4 h-[300px] w-full rounded-xl overflow-hidden border border-neutral-200">
                                <MapContainer
                                    center={[parseFloat(data.site_latitude), parseFloat(data.site_longitude)]}
                                    zoom={16}
                                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={[parseFloat(data.site_latitude), parseFloat(data.site_longitude)]} />
                                    <Circle
                                        center={[parseFloat(data.site_latitude), parseFloat(data.site_longitude)]}
                                        pathOptions={{ fillColor: '#035EA9', color: '#035EA9' }}
                                        radius={data.site_radius ? parseInt(data.site_radius) : 200}
                                    />
                                </MapContainer>
                            </div>
                        )}

                        {/* Separator */}
                        <div className="h-[1px] w-full bg-neutral-200 mt-4 mb-2"></div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3">
                            <Link href="/admin/projects" className="h-11 flex items-center justify-center px-6 rounded-lg border border-neutral-300 bg-white text-[#14141A] font-bold text-sm shadow-sm hover:bg-neutral-50 transition-colors">
                                Batal
                            </Link>
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="bg-[#035EA9] hover:bg-[#035EA9]/90 text-white font-bold h-11 px-6 rounded-lg flex items-center gap-2 text-sm shadow-sm"
                            >
                                {processing ? 'Menyimpan...' : (
                                    <>
                                        <Save className="h-4 w-4 shrink-0" />
                                        Simpan Proyek
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

ProjectsCreate.layout = (page: React.ReactNode) => (
    <AdminLayout breadcrumbs={[
        { title: 'Proyek', href: '/admin/projects' },
        { title: 'Tambah Proyek', href: '/admin/projects/create' }
    ]}>
        {page}
    </AdminLayout>
);
