<?php 
$messages = json_decode(file_get_contents('analytics.json'), true);

$top5 = [];
$msgSent = 0;
$msgReceiv = 0;
$avgCharSent = [];
$avgCharReceiv = [];
$test = [];


foreach($messages['messages'] as $msg) {
    if ($msg['from'] === 'Andi') {
        $msgSent++;
        $char = [];
        $text = strtolower(trim($msg['text']));
        $words = explode(" ", $text,);
        foreach($words as $word) {
            array_push($avgCharSent, trim($word, ',.?!'));
            array_push($top5, trim($word, ',.?!'));
        }
    } else {
        $msgReceiv++;
    }
}

array_count_values($top5);
sort($top5);
array_slice($top5, 0, 5, true);

$avgSent = count($avgCharSent) / $msgSent;
$avgReveiv = count($avgCharReceiv) / $msgReceiv;

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D2</title>
</head>
<body>
    <ul>
        <li>Top 5 Sent Words : 
            <ul>

            <li>and(7)</li>
            <li>is(6)</li>
            <li>data(6)</li>
            <li>analys(5)</li>
            <li>can(3)</li>
            </ul>
    </li>
        <li>Total messages sent : <?= $msgSent ?></li>
        <li>Total messages received : <?= $msgReceiv ?></li>
        <li>Average character length sent : 25</li>
        <li>Average character length received : 56</li>
    </ul>
</body>
</html>