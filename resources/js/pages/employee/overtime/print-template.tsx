import { parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Task {
    startTime: string;
    endTime: string;
    description: string;
}

interface PrintData {
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    client: string;
    orderNumber: string;
    spklNumber?: string;
    tasks: Task[];
    user: any;
}

function generateTasksHTML(tasks: Task[]): string {
    const validTasks = tasks.filter(t => t.description.trim() !== '' && t.startTime && t.endTime);

    if (validTasks.length === 0) {
        return `
            <div style="display:flex;">
                <div style="width:5%;">:</div>
                <div style="flex:1; border-bottom:1px dotted #000; min-height:20px;"></div>
            </div>
        `;
    }

    let html = '';
    validTasks.forEach((task, idx) => {
        html += `
            <div style="display:flex; margin-bottom:6px;">
                <div style="width:5%; text-align:center;">${idx === 0 ? ':' : ''}</div>
                <div style="flex:1;">
                    <div>Jam ${task.startTime} - ${task.endTime} melaksanakan pekerjaan</div>
                    <div style="width:100%; border-bottom:1px dotted #000; margin-top:3px;">${task.description}</div>
                    <div style="width:100%; border-bottom:1px dotted #000; margin-top:10px;"></div>
                </div>
            </div>
        `;
    });
    html += `<div style="margin-top:4px; margin-left:5%;">dan seterusnya</div>`;
    return html;
}

export function handlePrintExport(data: PrintData) {
    const { date, startTime, endTime, location, client, orderNumber, tasks, user } = data;

    const formattedDate = date
        ? format(parseISO(date), 'EEEE, d MMMM yyyy', { locale: id }).toUpperCase()
        : '.......................................';
    const shortDate = date
        ? format(parseISO(date), 'd MMMM yyyy', { locale: id }).toUpperCase()
        : '.......................';

    const userName = user?.name?.toUpperCase() || '.........................';
    let userStatus = '.........................';
    if (user?.role) {
        userStatus = user.role === 'intern' ? 'MAHASISWA MAGANG' : 'KARYAWAN PTT';
    }

    const tasksHTML = generateTasksHTML(tasks);

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Perintah & Laporan Kerja Lembur</title>
    <style>
        @page {
            size: A4;
            margin: 12mm 15mm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 13px;
            line-height: 1.4;
            color: #000;
            background: #fff;
        }
        .page {
            width: 100%;
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .outer-border {
            border: 2px solid #000;
            padding: 3px;
        }
        .inner-border {
            border: 1px solid #000;
            padding: 16px;
        }
        .inner-border-compact {
            border: 1px solid #000;
            padding: 12px;
        }
        .title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .title-text {
            text-decoration: underline;
            font-size: 15px;
        }
        .field-row {
            display: grid;
            grid-template-columns: 200px auto;
            gap: 4px 8px;
        }
        .field-row-compact {
            display: grid;
            grid-template-columns: 180px auto;
            gap: 2px 8px;
        }
        .field-value {
            display: flex;
        }
        .field-value span:first-child {
            margin-right: 8px;
        }
        .field-value .val {
            flex: 1;
            border-bottom: 1px solid #000;
        }
        .sig-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            text-align: center;
            margin-top: 40px;
        }
        .sig-grid-compact {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            text-align: center;
            margin-top: 8px;
        }
        .sig-col {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .sig-name {
            margin-top: 90px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .sig-name-compact {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .sig-line {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sig-underline {
            border-bottom: 1px solid #000;
            width: 200px;
            display: inline-block;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
        }
        .sig-underline-empty {
            border-bottom: 1px solid #000;
            width: 200px;
            display: inline-block;
            min-height: 1em;
        }
        .sig-label {
            margin-top: 4px;
            font-size: 12px;
        }
        .date-line {
            display: flex;
            align-items: baseline;
            justify-content: center;
            height: 20px;
        }
        .date-dots {
            width: 120px;
            border-bottom: 1px dotted #000;
            display: inline-block;
        }
        .footer-note {
            margin-top: 6px;
            font-size: 9px;
            font-style: italic;
            text-align: center;
            font-weight: bold;
        }
        .mengetahui {
            text-align: center;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <!-- ============================================================
         PAGE 1: SURAT PERINTAH KERJA LEMBUR
    ============================================================ -->
    <div class="page">
        <div class="header">
            <div>
                <div>PT SUCOFINDO(PERSERO)</div>
                <div>UNIT KERJA : ..........................</div>
            </div>
            <div style="text-align:right;">
                <div>Lampiran 1</div>
                <div style="text-decoration:underline;">KD No. 16/KD/2017</div>
            </div>
        </div>

        <div class="outer-border">
            <div class="inner-border">
                <div class="title">
                    <div class="title-text">SURAT PERINTAH KERJA LEMBUR</div>
                    <div>No. : ${data.spklNumber ? data.spklNumber : '...................................'}</div>
                </div>

                <div style="margin-bottom:12px; font-weight:bold;">Diperintahkan kepada :</div>
                <div class="field-row" style="margin-bottom:20px;">
                    <div>Nama / NPP</div>
                    <div class="field-value"><span>:</span> <span class="val" style="font-weight:bold; text-transform:uppercase;">${userName}</span></div>
                    
                    <div>Status Pegawai</div>
                    <div class="field-value"><span>:</span> <span class="val" style="text-transform:uppercase;">${userStatus}</span></div>
                    
                    <div>Strata (Grade)</div>
                    <div class="field-value"><span>:</span> <span class="val"></span></div>
                </div>

                <div style="margin-bottom:6px; font-weight:bold;">Untuk melaksanakan kerja lembur pada :</div>
                <div class="field-row" style="margin-bottom:10px;">
                    <div>Hari / Tanggal</div>
                    <div class="field-value"><span>:</span> <span class="val">${formattedDate}</span></div>
                    
                    <div>Waktu</div>
                    <div class="field-value">
                        <span>:</span>
                        <span style="width:80px; text-align:center; border-bottom:1px solid #000;">${startTime || '......'}</span>
                        <span style="margin:0 8px;">s/d</span>
                        <span style="width:80px; text-align:center; border-bottom:1px solid #000;">${endTime || '......'}</span>
                    </div>
                </div>

                <div class="field-row" style="margin-bottom:20px;">
                    <div>
                        <div>Untuk pelaksanaan pekerjaan</div>
                        <div>(Ditulis secara rinci dan wajib</div>
                        <div>diisi)</div>
                    </div>
                    <div>
                        ${tasksHTML}
                    </div>
                </div>

                <div class="field-row" style="margin-bottom:10px;">
                    <div>Tempat kerja lembur</div>
                    <div class="field-value"><span>:</span> <span class="val">${location}</span></div>
                    
                    <div>Nama Pelanggan (Jika ada)</div>
                    <div class="field-value"><span>:</span> <span class="val">${client}</span></div>
                    
                    <div>Nomor Order (Jika ada)</div>
                    <div class="field-value"><span>:</span> <span class="val">${orderNumber}</span></div>
                </div>

                <!-- Signatures -->
                <div class="sig-grid">
                    <div class="sig-col">
                        <div>
                            <div style="height:20px;"></div>
                            <div>Menyetujui,</div>
                            <div>Yang diperintah,</div>
                        </div>
                        <div class="sig-name">
                            <div class="sig-line">( <span class="sig-underline">${userName}</span> )</div>
                            <div class="sig-label">&nbsp;</div>
                        </div>
                    </div>
                    <div class="sig-col">
                        <div>
                            <div class="date-line">
                                <span class="date-dots"></span>
                                <span>, ${shortDate}</span>
                            </div>
                            <div>Yang memerintahkan</div>
                        </div>
                        <div class="sig-name">
                            <div class="sig-line">( <span class="sig-underline-empty"></span> )</div>
                            <div class="sig-label">Atasan Langsung</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ============================================================
         PAGE 2: LAPORAN HASIL KERJA LEMBUR
    ============================================================ -->
    <div class="page">
        <div class="header">
            <div>
                <div>PT SUCOFINDO(PERSERO)</div>
                <div>UNIT KERJA : ..........................</div>
            </div>
            <div style="text-align:right;">
                <div>Lampiran 2</div>
                <div style="text-decoration:underline;">KD No. 16/KD/2017</div>
            </div>
        </div>

        <div class="outer-border">
            <div class="inner-border">
                <div class="title">
                    <div class="title-text">LAPORAN HASIL KERJA LEMBUR</div>
                </div>

                <div style="display:flex; margin-bottom:12px;">
                    berdasarkan Surat Perintah Kerja Lembur No : <span style="flex:1; border-bottom:1px dotted #000; margin:0 8px; text-align:center;">${data.spklNumber ? data.spklNumber : ''}</span> Tanggal : <span style="flex:1; border-bottom:1px dotted #000; text-align:center; padding-left:8px;">${data.spklNumber ? formattedDate : ''}</span>
                </div>

                <div style="margin-bottom:6px; font-weight:bold;">Telah dilaksanakan kerja lembur pada :</div>
                <div class="field-row" style="margin-bottom:10px;">
                    <div>Hari / Tanggal</div>
                    <div class="field-value"><span>:</span> <span class="val">${formattedDate}</span></div>
                    
                    <div>Waktu</div>
                    <div class="field-value">
                        <span>:</span>
                        <span style="width:80px; text-align:center; border-bottom:1px solid #000;">${startTime || '......'}</span>
                        <span style="margin:0 8px;">s/d</span>
                        <span style="width:80px; text-align:center; border-bottom:1px solid #000;">${endTime || '......'}</span>
                    </div>
                </div>

                <div class="field-row" style="margin-bottom:20px;">
                    <div>
                        <div>Untuk pelaksanaan pekerjaan</div>
                        <div>(Ditulis secara rinci dan wajib</div>
                        <div>diisi)</div>
                    </div>
                    <div>
                        ${tasksHTML}
                    </div>
                </div>

                <!-- Signatures -->
                <div class="sig-grid">
                    <div class="sig-col">
                        <div>
                            <div style="height:20px;"></div>
                            <div>Disetujui,</div>
                        </div>
                        <div class="sig-name">
                            <div class="sig-line">( <span class="sig-underline-empty"></span> )</div>
                            <div class="sig-label">Atasan Langsung</div>
                        </div>
                    </div>
                    <div class="sig-col">
                        <div>
                            <div class="date-line">
                                <span class="date-dots"></span>
                                <span>, ${shortDate}</span>
                            </div>
                            <div>Yang melaksanakan</div>
                        </div>
                        <div class="sig-name">
                            <div class="sig-line">( <span class="sig-underline">${userName}</span> )</div>
                            <div class="sig-label">NPP .................../Jabatan</div>
                        </div>
                    </div>
                </div>

                <div class="mengetahui" style="margin-top:12px;">
                    <div>Mengetahui</div>
                    <div class="sig-name">
                        <div class="sig-line">( <span class="sig-underline-empty" style="width:240px;"></span> )</div>
                        <div class="sig-label">Kepala Cabang</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-note">
            Surat Perintah Kerja Lembur dan hasil Kerja Lembur harus diserahkan setiap hari setelah melaksanakan kerja lembur atau selambat-lambatnya 2x 24 jam ke fungsi SDM/HC
        </div>
    </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
        alert('Popup diblokir oleh browser. Mohon izinkan popup untuk fitur ini.');
        return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print();
        }, 300);
    };

    // Fallback if onload doesn't fire
    setTimeout(() => {
        printWindow.print();
    }, 1000);
}
