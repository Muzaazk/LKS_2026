<?php 
    $getImg = file_get_contents('image.jpg');
    $image = imagecreatefromstring($getImg);
    $logo1 = imagecreatefrompng('logo1.png');
    $logo2 = imagecreatefrompng('logo2.png');

    imagealphablending($image, true);
    imagesavealpha($image, true);

    $margin = 40;

    $imageX = imagesx($image);
    $imageY = imagesy($image);

    $logo2X = imagesx($logo2);
    $logo2Y = imagesy($logo2);

    $x = $imageX - $logo2X - $margin;
    $y = $logo2Y;

    imagecopy($image, $logo2, $x, $y, 0, 0, $logo2X, $logo2Y);
    $path = 'watermark.png';

    imagepng($image, $path);

    imagedestroy($image);
    imagedestroy($logo2);

    echo "<img src='$path'/>" 
    ?>

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D3</title>
</head>
<body>
    <img src="image.jpg" alt="">
</body>
</html>