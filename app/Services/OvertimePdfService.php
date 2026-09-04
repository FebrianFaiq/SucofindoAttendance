<?php

namespace App\Services;

class OvertimePdfService
{
    public static function parseDescription(?string $desc): array
    {
        $location = '';
        $client = '';
        $orderNumber = '';
        $tasks = [];

        if (empty(trim($desc))) {
            return [
                'location' => $location,
                'client' => $client,
                'orderNumber' => $orderNumber,
                'tasks' => $tasks,
            ];
        }

        // Parse header [Lokasi: xxx | Klien: xxx | No Order: xxx]
        if (preg_match('/\[Lokasi: (.*?) \| Klien: (.*?) \| No Order: (.*?)\]/', $desc, $matches)) {
            $location = $matches[1] === '-' ? '' : trim($matches[1]);
            $client = $matches[2] === '-' ? '' : trim($matches[2]);
            $orderNumber = $matches[3] === '-' ? '' : trim($matches[3]);
        }

        $lines = explode("\n", $desc);
        $isTaskSection = false;

        foreach ($lines as $line) {
            $line = trim($line);
            if (str_starts_with($line, 'Pekerjaan:')) {
                $isTaskSection = true;

                continue;
            }

            if ($isTaskSection && $line !== '') {
                // Parse "1. [19:00 - 20:00] task description"
                if (preg_match('/^\d+\.\s*\[(.*?)\s*-\s*(.*?)\]\s*(.*)$/', $line, $taskMatches)) {
                    $tasks[] = [
                        'startTime' => $taskMatches[1] === '?' ? '' : $taskMatches[1],
                        'endTime' => $taskMatches[2] === '?' ? '' : $taskMatches[2],
                        'description' => $taskMatches[3],
                    ];
                } else {
                    if (count($tasks) > 0) {
                        $tasks[count($tasks) - 1]['description'] .= "\n".$line;
                    } else {
                        $tasks[] = [
                            'startTime' => '',
                            'endTime' => '',
                            'description' => $line,
                        ];
                    }
                }
            }
        }

        if (count($tasks) === 0 && trim($desc) !== '') {
            $cleanDesc = preg_replace('/\[Lokasi.*?\]\s*Pekerjaan:\s*/', '', $desc);
            $tasks[] = [
                'startTime' => '',
                'endTime' => '',
                'description' => trim($cleanDesc),
            ];
        }

        return [
            'location' => $location,
            'client' => $client,
            'orderNumber' => $orderNumber,
            'tasks' => $tasks,
        ];
    }
}
