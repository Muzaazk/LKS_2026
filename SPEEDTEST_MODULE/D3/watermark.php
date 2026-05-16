<?php
// $imageTmp = $_FILES['image']['tmp_name'];
// $logoTmp = $_FILES['logo']['tmp_name'];

$image = imagecreatefromstring(file_get_contents('a.png'));
$logo = imagecreatefrompng('b.png');

imagealphablending($image, true);
imagesavealpha($image, true);

$imageX = imagesx($image);
$imageY = imagesy($image);

$margin = 10;

$logoX = imagesx($logo);
$logoY = imagesy($logo);

$x = $imageX - $logoX - $margin;
$y = $margin;

imagecopy($image, $logo, $x, $y, 0, 0, $logoX, $logoY);
$path = 'watermark3.png';

imagepng($image, $path);
imagedestroy($image);
imagedestroy($logo);

echo "<img src='$path'>";
