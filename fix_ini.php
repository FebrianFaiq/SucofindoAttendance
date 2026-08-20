<?php

$path = 'D:/laragon/bin/php/php-8.4.24-nts-Win32-vs17-x64/php.ini';
$content = file_get_contents($path);

// Clean up UTF-16 null bytes if any
$content = str_replace("\x00", '', $content);

// Remove the corrupted trailing lines added by powershell
$content = preg_replace('/e x t e n s i o n = z i p/is', '', $content);
$content = preg_replace('/e x t e n s i o n _ d i r = e x t/is', '', $content);
$content = preg_replace('/extension=zip/is', '', $content);
$content = preg_replace('/extension_dir="ext"/is', '', $content);

$content = trim($content)."\n\nextension_dir=\"ext\"\nextension=zip\n";
file_put_contents($path, $content);
echo "Cleaned up and added zip extension.\n";
