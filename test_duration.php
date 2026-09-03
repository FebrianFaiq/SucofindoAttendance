<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

use App\Services\Overtime\OvertimeCalculationService;
use Carbon\Carbon;
use Illuminate\Contracts\Console\Kernel;

$service = new OvertimeCalculationService;
echo 'Calc 18:00 - 21:00: '.$service->calculateDuration('18:00', '21:00')."\n";
echo 'Calc 22:00 - 02:00: '.$service->calculateDuration('22:00', '02:00')."\n";

$start = Carbon::parse('18:00');
$end = Carbon::parse('21:00');
echo 'Diff: '.$end->diffInMinutes($start)."\n";
echo 'Diff false: '.$end->diffInMinutes($start, false)."\n";
