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
    const TOTAL_SLOTS = 4;
    let html = '';

    for (let i = 0; i < TOTAL_SLOTS; i++) {
        const task = tasks[i];
        const isFilled = task && task.description.trim() !== '' && task.startTime && task.endTime;

        if (isFilled) {
            html += `
                <div style="display:flex; margin-bottom:16px;">
                    <div style="width:5%; text-align:center;">${i === 0 ? ':' : ''}</div>
                    <div style="flex:1;">
                        <div>Jam ${task.startTime} - ${task.endTime} melaksanakan pekerjaan</div>
                        <div style="width:100%; border-bottom:1px dotted #000; margin-top:8px; line-height: 1.6;">${task.description}</div>
                        <div style="width:100%; border-bottom:1px dotted #000; margin-top:16px;"></div>
                    </div>
                </div>
            `;
        } else {
            html += `
                <div style="display:flex; margin-bottom:16px;">
                    <div style="width:5%; text-align:center;">${i === 0 ? ':' : ''}</div>
                    <div style="flex:1;">
                        <div>Jam --:-- - --:-- melaksanakan pekerjaan</div>
                        <div style="width:100%; border-bottom:1px dotted #000; margin-top:8px; line-height: 1.6;"></div>
                        <div style="width:100%; border-bottom:1px dotted #000; margin-top:16px;"></div>
                    </div>
                </div>
            `;
        }
    }

    html += `<div style="margin-top:12px; margin-left:5%;">dan seterusnya</div>`;
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
        userStatus = user.role === 'intern' ? 'MAGANG' : 'PTT PROYEK';
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
            margin: 15mm;
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
            padding: 20px;
        }
        .page {
            width: 100%;
            display: flex;
            flex-direction: column;
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
            font-weight: bold;
        }
        .single-border {
            border: 1px solid #000;
            padding: 16px;
            display: flex;
            flex-direction: column;
        }
        .section-box {
            border: 1px solid #000;
            padding: 16px;
        }
        .title {
            text-align: center;
            font-weight: bold;
        }
        .title-text {
            text-decoration: underline;
            font-size: 15px;
            margin-bottom: 6px;
        }
        .field-row {
            display: grid;
            grid-template-columns: 200px auto;
            gap: 8px;
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
            gap: 24px;
            text-align: center;
            margin-top: 24px;
        }
        .sig-col {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .sig-name {
            align-items: center;
        }
        .sig-space {
            height: 80px;
        }
        .sig-line {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sig-underline {
            border-bottom: 1px solid #000;
            width: 220px;
            display: inline-block;
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
        }
        .sig-underline-empty {
            border-bottom: 1px solid #000;
            width: 220px;
            display: inline-block;
            min-height: 1em;
        }
        .sig-label {
            margin-top: 6px;
            font-size: 12px;
        }
        .date-line {
            display: flex;
            align-items: baseline;
            justify-content: center;
            height: 20px;
        }
        .date-dots {
            width: 140px;
            border-bottom: 1px dotted #000;
            display: inline-block;
        }
        .footer-note {
            margin-top: 10px;
            font-size: 10px;
            font-style: italic;
            text-align: center;
            font-weight: bold;
        }
        .mengetahui {
            text-align: center;
            margin-top: 24px;
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

        <div class="single-border">
            <div class="section-box" style="margin-bottom:16px;">
                <div class="title">
                    <div class="title-text">SURAT PERINTAH KERJA LEMBUR</div>
                    <div>No. : ${data.spklNumber ? data.spklNumber : '...................................'}</div>
                </div>
            </div>

            <div class="section-box" style="padding:20px;">
                <div style="margin-bottom:8px; font-weight:bold;">Diperintahkan kepada :</div>
                <div class="field-row" style="margin-bottom:20px;">
                    <div>Nama / NPP</div>
                    <div class="field-value"><span>:</span> <span class="val" style="font-weight:bold; text-transform:uppercase;">${userName}</span></div>
                    
                    <div>Status Pegawai</div>
                    <div class="field-value"><span>:</span> <span class="val" style="text-transform:uppercase;">${userStatus}</span></div>
                    
                    <div>Strata (Grade)</div>
                    <div class="field-value"><span>:</span> <span class="val"></span></div>
                </div>

                <div style="margin-bottom:8px; font-weight:bold;">Untuk melaksanakan kerja lembur pada :</div>
                <div class="field-row" style="margin-bottom:20px;">
                    <div>Hari / Tanggal</div>
                    <div class="field-value"><span>:</span> <span class="val">${formattedDate}</span></div>
                    
                    <div>Waktu</div>
                    <div class="field-value">
                        <span>:</span>
                        <span style="width:100px; text-align:center; border-bottom:1px solid #000;">${startTime || '......'}</span>
                        <span style="margin:0 12px;">s/d</span>
                        <span style="width:100px; text-align:center; border-bottom:1px solid #000;">${endTime || '......'}</span>
                    </div>
                </div>

                <div class="field-row" style="margin-bottom:30px;">
                    <div>
                        <div>Untuk pelaksanaan pekerjaan</div>
                        <div>(Ditulis secara rinci dan wajib</div>
                        <div>diisi)</div>
                    </div>
                    <div>
                        ${tasksHTML}
                    </div>
                </div>

                <div class="field-row" style="margin-bottom:20px;">
                    <div>Tempat kerja lembur</div>
                    <div class="field-value"><span>:</span> <span class="val">${location}</span></div>
                    
                    <div>Nama Pelanggan (Jika ada)</div>
                    <div class="field-value"><span>:</span> <span class="val">${client}</span></div>
                    
                    <div>Nomor Order (Jika ada)</div>
                    <div class="field-value"><span>:</span> <span class="val">${orderNumber}</span></div>
                </div>

                <div class="section-box" style="padding:16px;">
                    <div class="sig-grid" style="margin-top:0;">
                        <div class="sig-col">
                            <div>
                                <div style="height:20px;"></div>
                                <div>Menyetujui,</div>
                                <div>Yang diperintah,</div>
                            </div>
                            <div class="sig-space"></div>
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
                            <div class="sig-space"></div>
                            <div class="sig-name">
                                <div class="sig-line">( <span class="sig-underline-empty"></span> )</div>
                                <div class="sig-label">Atasan Langsung</div>
                            </div>
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

        <div class="single-border">
            <div class="section-box" style="margin-bottom:16px;">
                <div class="title">
                    <div class="title-text">LAPORAN HASIL KERJA LEMBUR</div>
                </div>
            </div>

            <div class="section-box" style="padding:20px;">
                <div style="display:flex; margin-bottom:24px; line-height: 1.6;">
                    berdasarkan Surat Perintah Kerja Lembur No : <span style="flex:1; border-bottom:1px dotted #000; margin:0 12px; text-align:center;">${data.spklNumber ? data.spklNumber : ''}</span> Tanggal : <span style="flex:1; border-bottom:1px dotted #000; text-align:center; padding-left:12px;">${data.spklNumber ? formattedDate : ''}</span>
                </div>

                <div style="margin-bottom:8px; font-weight:bold;">Telah dilaksanakan kerja lembur pada :</div>
                <div class="field-row" style="margin-bottom:20px;">
                    <div>Hari / Tanggal</div>
                    <div class="field-value"><span>:</span> <span class="val">${formattedDate}</span></div>
                    
                    <div>Waktu</div>
                    <div class="field-value">
                        <span>:</span>
                        <span style="width:100px; text-align:center; border-bottom:1px solid #000;">${startTime || '......'}</span>
                        <span style="margin:0 12px;">s/d</span>
                        <span style="width:100px; text-align:center; border-bottom:1px solid #000;">${endTime || '......'}</span>
                    </div>
                </div>

                <div class="field-row" style="margin-bottom:30px;">
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
                <div class="section-box" style="padding:16px;">
                    <div class="sig-grid" style="margin-top:0;">
                        <div class="sig-col">
                            <div>
                                <div style="height:20px;"></div>
                                <div>Disetujui,</div>
                            </div>
                            <div class="sig-space"></div>
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
                            <div class="sig-space"></div>
                            <div class="sig-name">
                                <div class="sig-line">( <span class="sig-underline">${userName}</span> )</div>
                                <div class="sig-label">NPP .................../Jabatan</div>
                            </div>
                        </div>
                    </div>

                    <div class="mengetahui">
                        <div>Mengetahui</div>
                        <div class="sig-space"></div>
                        <div class="sig-name">
                            <div class="sig-line">( <span class="sig-underline-empty" style="width:260px;"></span> )</div>
                            <div class="sig-label">Kepala Cabang</div>
                        </div>
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
}`;

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
