<!DOCTYPE html>
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
            page-break-after: always;
        }
        .page:last-child {
            page-break-after: auto;
        }
    </style>
</head>
<body>
    @php
        $formattedDate = $date ? \Carbon\Carbon::parse($date)->locale('id')->isoFormat('dddd, D MMMM YYYY') : '.......................................';
        $shortDate = $date ? \Carbon\Carbon::parse($date)->locale('id')->isoFormat('D MMMM YYYY') : '.......................';
        $formattedDate = strtoupper($formattedDate);
        $shortDate = strtoupper($shortDate);
        $userName = strtoupper($user->name ?? '.........................');
        $userStatus = '.........................';
        if (isset($user->role)) {
            $userStatus = $user->role === 'intern' ? 'MAGANG' : 'PTT PROYEK';
        }
        $spklNumber = $spklNumber ?? '.......................................';
        if (empty($spklNumber)) $spklNumber = '.......................................';
    @endphp

    <!-- ============================================================
         PAGE 1: SURAT PERINTAH KERJA LEMBUR
    ============================================================ -->
    <!-- ============================================================
     PAGE 1: SURAT PERINTAH KERJA LEMBUR
============================================================ -->
<div class="page">

    <!-- LOGO PLACEHOLDER - UKURAN LOGO TIDAK DIUBAH -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
        <tr>
            <td width="33%" align="left" valign="middle">
                @if(!empty($logoLeft))
                    <img src="{{ $logoLeft }}" style="height: 40px;">
                @else
                    <table cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center" valign="middle"
                                style="border: 1px dashed #999; width: 65px; height: 40px; font-size: 8px; color: #999;">
                                LOGO 1
                            </td>
                        </tr>
                    </table>
                @endif
            </td>

            <td width="34%" align="center" valign="middle">
                @if(!empty($logoCenter))
                    <img src="{{ $logoCenter }}" style="height: 40px;">
                @else
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                            <td align="center" valign="middle"
                                style="border: 1px dashed #999; width: 65px; height: 40px; font-size: 8px; color: #999;">
                                LOGO 2
                            </td>
                        </tr>
                    </table>
                @endif
            </td>

            <td width="33%" align="right" valign="middle">
                @if(!empty($logoRight))
                    <img src="{{ $logoRight }}" style="height: 40px;">
                @else
                    <table cellpadding="0" cellspacing="0" style="margin-left: auto;">
                        <tr>
                            <td align="center" valign="middle"
                                style="border: 1px dashed #999; width: 65px; height: 40px; font-size: 8px; color: #999;">
                                LOGO 3
                            </td>
                        </tr>
                    </table>
                @endif
            </td>
        </tr>
    </table>


    <!-- HEADER -->
    <table width="100%"
           style="margin-bottom: 14px; font-weight: bold; font-size: 13px;">
        <tr>
            <td align="left" valign="top">
                PT SUCOFINDO(PERSERO)<br>
                UNIT KERJA : CABANG SURABAYA   
            </td>

            <td align="right" valign="top">
                Lampiran 1<br>
                <u>KD No. 16/KD/2017</u>
            </td>
        </tr>
    </table>


    <!-- OUTER BORDER -->
    <div style="border: 1px solid #000; padding: 14px;">

        <!-- TITLE BOX -->
        <div style="
            border: 1px solid #000;
            padding: 12px;
            margin-bottom: 14px;
            text-align: center;
            font-weight: bold;
        ">
            <div style="
                text-decoration: underline;
                font-size: 15px;
                margin-bottom: 5px;
            ">
                SURAT PERINTAH KERJA LEMBUR
            </div>

            <div>
                No. : {{ $spklNumber }}
            </div>
        </div>


        <!-- BODY BOX -->
        <div style="
            border: 1px solid #000;
            padding: 16px;
        ">

            <!-- ================================
                 DATA PEGAWAI
            ================================= -->
            <div style="
                font-weight: bold;
                margin-bottom: 7px;
            ">
                Diperintahkan kepada :
            </div>

            <table width="100%"
                   cellpadding="7"
                   cellspacing="0"
                   style="margin-bottom: 17px;">

                <tr>
                    <td width="200">Nama / NPP</td>
                    <td width="10">:</td>
                    <td style="
                        border-bottom: 1px solid #000;
                        font-weight: bold;
                    ">
                        {{ $userName }}
                    </td>
                </tr>

                <tr>
                    <td>Status Pegawai</td>
                    <td>:</td>
                    <td style="border-bottom: 1px solid #000;">
                        {{ $userStatus }}
                    </td>
                </tr>

                <tr>
                    <td>Strata (Grade)</td>
                    <td>:</td>
                    <td style="border-bottom: 1px solid #000;">
                    </td>
                </tr>

            </table>


            <!-- ================================
                 WAKTU LEMBUR
            ================================= -->
            <div style="
                font-weight: bold;
                margin-bottom: 7px;
            ">
                Untuk melaksanakan kerja lembur pada :
            </div>

            <table width="100%"
                   cellpadding="7"
                   cellspacing="0"
                   style="margin-bottom: 17px;">

                <tr>
                    <td width="200">Hari / Tanggal</td>
                    <td width="10">:</td>
                    <td style="border-bottom: 1px solid #000;">
                        {{ $formattedDate }}
                    </td>
                </tr>

                <tr>
                    <td style="padding-top: 9px;">Waktu</td>

                    <td style="padding-top: 9px;">:</td>

                    <td style="padding-top: 9px;">

                        <span style="
                            border-bottom: 1px solid #000;
                            display: inline-block;
                            width: 100px;
                            text-align: center;
                        ">
                            {{ empty($startTime) ? '......' : $startTime }}
                        </span>

                        &nbsp;&nbsp;s/d&nbsp;&nbsp;

                        <span style="
                            border-bottom: 1px solid #000;
                            display: inline-block;
                            width: 100px;
                            text-align: center;
                        ">
                            {{ empty($endTime) ? '......' : $endTime }}
                        </span>

                    </td>
                </tr>

            </table>


            <!-- ================================
                 DETAIL PEKERJAAN
            ================================= -->
            <table width="100%"
                   cellpadding="0"
                   cellspacing="0"
                   style="margin-bottom: 17px;">

                <tr>

                    <td width="200" valign="top">
                        <div>
                            Untuk pelaksanaan pekerjaan<br>
                            <span style="font-size: 12px;">
                                (Ditulis secara rinci dan wajib<br>
                                diisi)
                            </span>
                        </div>
                    </td>

                    <td width="10"
                        valign="top"
                        style="padding-top: 2px;">
                        :
                    </td>

                    <td valign="top">

                        @for ($i = 0; $i < 4; $i++)

                            @php
                                $task = $tasks[$i] ?? null;
                                $isFilled = $task && !empty(trim($task['description']));
                            @endphp

                            <div style="margin-bottom: 13px;">

                                <div style="margin-bottom: 4px;">

                                    @if($isFilled)

                                        Jam {{ empty($task['startTime']) ? '?' : $task['startTime'] }}
                                        sampai
                                        {{ empty($task['endTime']) ? '?' : $task['endTime'] }}
                                        melaksanakan pekerjaan

                                    @else

                                        Jam --:-- sampai --:-- melaksanakan pekerjaan

                                    @endif

                                </div>


                                <div style="
                                    border-bottom: 1px dashed #000;
                                    min-height: 17px;
                                    line-height: 1.5;
                                    margin-top: 4px;
                                ">
                                    @if($isFilled)
                                        {{ nl2br(e($task['description'])) }}
                                    @endif
                                </div>


                                <div style="
                                    border-bottom: 1px dashed #000;
                                    min-height: 17px;
                                    margin-top: 4px;
                                ">
                                </div>

                            </div>

                        @endfor

                        <div style="margin-top: 7px;">
                            dan seterusnya
                        </div>

                    </td>

                </tr>

            </table>


            <!-- ================================
                 BOTTOM FIELDS
            ================================= -->
            <table width="100%"
                   cellpadding="7"
                   cellspacing="0"
                   style="margin-bottom: 17px;">

                <tr>
                    <td width="200">
                        Tempat kerja lembur
                    </td>

                    <td width="10">:</td>

                    <td style="border-bottom: 1px solid #000;">
                        {{ $location }}
                    </td>
                </tr>

                <tr>
                    <td>
                        Nama Pelanggan (Jika ada)
                    </td>

                    <td>:</td>

                    <td style="border-bottom: 1px solid #000;">
                        {{ $client }}
                    </td>
                </tr>

                <tr>
                    <td>
                        Nomor Order (Jika ada)
                    </td>

                    <td>:</td>

                    <td style="border-bottom: 1px solid #000;">
                        {{ $orderNumber }}
                    </td>
                </tr>

            </table>


            <!-- ================================
                 SIGNATURE BOX
            ================================= -->
            <table width="100%"
       cellpadding="16"
       cellspacing="0"
       style="border: 1px solid #000;">

    <tr>
        <td>

            <table width="100%"
                   cellpadding="0"
                   cellspacing="0"
                   style="text-align: center;">

                <tr>

                    <!-- YANG DIPERINTAH -->
                    <td width="50%" valign="top">

                        <div>
                            Menyetujui,
                        </div>

                        <div>
                            Yang diperintah,
                        </div>

                        <!-- RUANG TANDA TANGAN -->
                        <div style="height: 80px;"></div>

                        <div>
                            (
                            <span style="
                                display: inline-block;
                                border-bottom: 1px solid #000;
                                width: 220px;
                                font-weight: bold;
                            ">
                                {{ $userName }}
                            </span>
                            )
                        </div>

                    </td>


                    <!-- YANG MEMERINTAH -->
                    <td width="50%" valign="top">

                        <div>
                            ..........................., {{ $shortDate }}
                        </div>

                        <div>
                            Yang memerintahkan
                        </div>

                        <!-- RUANG TANDA TANGAN -->
                        <div style="height: 80px;"></div>

                        <div>
                            (
                            <span style="
                                display: inline-block;
                                border-bottom: 1px solid #000;
                                width: 220px;
                            ">
                            </span>
                            )
                        </div>

                        <div style="
                            font-size: 11px;
                            margin-top: 6px;
                        ">
                            Atasan Langsung
                        </div>

                    </td>

                </tr>

            </table>

        </td>
    </tr>

</table>

        </div>

    </div>

</div>


    <!-- ============================================================
         PAGE 2: LAPORAN HASIL KERJA LEMBUR
    ============================================================ -->
    <div class="page">
    <!-- LOGO PLACEHOLDER (3 logo sejajar kiri-tengah-kanan) -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
        <tr>
            <td width="33%" align="left" valign="middle">
                @if(!empty($logoLeft))
                    <img src="{{ $logoLeft }}" style="height: 45px;">
                @else
                    <table cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle" style="border: 1px dashed #999; width: 70px; height: 45px; font-size: 8px; color: #999;">LOGO 1</td></tr></table>
                @endif
            </td>
            <td width="34%" align="center" valign="middle">
                @if(!empty($logoCenter))
                    <img src="{{ $logoCenter }}" style="height: 45px;">
                @else
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;"><tr><td align="center" valign="middle" style="border: 1px dashed #999; width: 70px; height: 45px; font-size: 8px; color: #999;">LOGO 2</td></tr></table>
                @endif
            </td>
            <td width="33%" align="right" valign="middle">
                @if(!empty($logoRight))
                    <img src="{{ $logoRight }}" style="height: 45px;">
                @else
                    <table cellpadding="0" cellspacing="0" style="margin-left: auto;"><tr><td align="center" valign="middle" style="border: 1px dashed #999; width: 70px; height: 45px; font-size: 8px; color: #999;">LOGO 3</td></tr></table>
                @endif
            </td>
        </tr>
    </table>

    <!-- HEADER -->
    <table width="100%" style="margin-bottom: 14px; font-weight: bold; font-size: 13px;">
        <tr>
            <td align="left" valign="top">
                PT SUCOFINDO(PERSERO)<br>
                UNIT KERJA : CABANG SURABAYA
            </td>
            <td align="right" valign="top">
                Lampiran 2<br>
                <u>KD No. 16/KD/2017</u>
            </td>
        </tr>
    </table>

    <!-- OUTER BOX: TANPA width eksplisit, biar block-fill natural -->
    <div style="border: 1px solid #000; padding: 15px;">

        <!-- TITLE BOX -->
        <div style="border: 1px solid #000; padding: 16px; margin-bottom: 16px; text-align: center; font-weight: bold;">
            <div style="text-decoration: underline; font-size: 15px; margin-bottom: 6px;">LAPORAN HASIL KERJA LEMBUR</div>
            <div>No. : {{ $spklNumber }}</div>
        </div>

        <!-- BODY BOX -->
        <div style="border: 1px solid #000; padding: 20px; position: relative; height: 198mm;">

            <div style="padding-bottom: 260px;">
                <!-- ================================
     INFORMASI SURAT & WAKTU LEMBUR
================================= -->

<!-- Berdasarkan Surat Perintah -->
<div style="
    margin-bottom: 12px;
    line-height: 1.5;
">
    <span>Berdasarkan</span>
    <span>
        Surat Perintah Kerja Lembur No. :
        <span style="
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 180px;
            font-weight: bold;
        ">
            {{ $spklNumber }}
        </span>
    </span>

    <span style="margin-left: 8px;">
        tanggal
        <span style="
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 130px;
            text-align: center;
        ">
            {{ $shortDate }}
        </span>
    </span>
</div>


<!-- Judul bagian lembur -->
<div style="
    font-weight: bold;
    margin-bottom: 8px;
">
    Telah dilaksanakan kerja lembur pada :
</div>


<!-- Hari / Tanggal & Waktu -->
<table width="100%"
       cellpadding="6"
       cellspacing="0"
       style="margin-bottom: 20px;">

    <tr>
        <td width="200">
            Hari / Tanggal
        </td>

        <td width="10">
            :
        </td>

        <td style="
            border-bottom: 1px solid #000;
        ">
            {{ $formattedDate }}
        </td>
    </tr>

    <tr>
        <td style="padding-top: 8px;">
            Waktu
        </td>

        <td style="padding-top: 8px;">
            :
        </td>

        <td style="padding-top: 8px;">

            <span style="
                display: inline-block;
                border-bottom: 1px solid #000;
                width: 100px;
                text-align: center;
            ">
                {{ empty($startTime) ? '--:--' : $startTime }}
            </span>

            &nbsp;&nbsp;s/d&nbsp;&nbsp;

            <span style="
                display: inline-block;
                border-bottom: 1px solid #000;
                width: 100px;
                text-align: center;
            ">
                {{ empty($endTime) ? '--:--' : $endTime }}
            </span>

        </td>
    </tr>

</table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                    <tr>
                        <td width="200" valign="top" style="font-weight: bold;">
                            Hasil Pelaksanaan Pekerjaan<br>
                            Lembur (Ditulis secara rinci)
                        </td>
                        <td width="10" valign="top" style="padding-top: 2px;">:</td>
                        <td valign="top">
                            @for ($i = 0; $i < 4; $i++)
                                @php
                                    $task = $tasks[$i] ?? null;
                                    $isFilled = $task && !empty(trim($task['description']));
                                @endphp
                                @if($isFilled)
                                    <div style="margin-bottom: 16px;">
                                        <div style="margin-bottom: 4px;">
                                            Jam {{ empty($task['startTime']) ? '?' : $task['startTime'] }} sampai {{ empty($task['endTime']) ? '?' : $task['endTime'] }} melaksanakan pekerjaan
                                        </div>
                                        <div style="border-bottom: 1px dashed #000; min-height: 20px; line-height: 1.6; margin-top: 4px;">
                                            {{ nl2br(e($task['description'])) }}
                                        </div>
                                        <div style="border-bottom: 1px dashed #000; min-height: 20px; margin-top: 4px;"></div>
                                    </div>
                                @endif
                            @endfor
                        </td>
                    </tr>
                </table>
            </div>

            <!-- SIGNATURE BOX -->
            <div style="position: absolute; bottom: 20px; left: 20px; right: 20px;">
                <table width="100%" cellpadding="16" cellspacing="0" style="border: 1px solid #000;">
                    <tr>
                        <td>
                            <table width="100%" style="text-align: center;">
                                <tr>
                                    <td width="50%" valign="top">
                                        <div>Disetujui,</div>
                                        <div>&nbsp;</div>
                                        <div style="height: 80px;"></div>
                                        <div>( <span style="display:inline-block; border-bottom:1px solid #000; width: 220px;"></span> )</div>
                                        <div style="font-size: 11px; margin-top: 6px;">Atasan Langsung</div>
                                    </td>
                                    <td width="50%" valign="top">
                                        <div>..........................., {{ $shortDate }}</div>
                                        <div>Yang melaksanakan</div>
                                        <div style="height: 80px;"></div>
                                        <div>( <span style="display:inline-block; border-bottom:1px solid #000; width: 220px; font-weight:bold;">{{ $userName }}</span> )</div>
                                        <div style="font-size: 11px; margin-top: 6px;">NPP .................../Jabatan</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" valign="top" style="padding-top: 24px;">
                                        <div>Mengetahui</div>
                                        <div style="height: 80px;"></div>
                                        <div>( <span style="display:inline-block; border-bottom:1px solid #000; width: 220px;"></span> )</div>
                                        <div style="font-size: 11px; margin-top: 6px;">Kepala Cabang</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <!-- FOOTER TEXT: kembali ke luar outer box, sesuai style asli -->
    <div style="margin-top: 10px; font-size: 13px; font-style: italic; text-align: justify;">
        Surat Perintah Kerja Lembur dan hasil Kerja Lembur harus diserahkan setiap hari setelah melaksanakan kerja lembur atau selambat-lambatnya 2x 24 jam ke fungsi SDM/HC
    </div>
</div>
</body>
</html>