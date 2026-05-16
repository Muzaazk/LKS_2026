<?php

$getMessage = file_get_contents('result.json');
$message = json_decode($getMessage, true);

$countSent = 0;
$countReceiv = 0;
$avgSent = 0;
$avgReceiv = 0;
$topSent = [];

foreach ($message['messages'] as $msg) {
    $m = $msg;
    $len = strlen($m["text"]);

    if ($m['from'] == 'Budi') {
        $countSent++;
        $avgSent += $len;

        $mLower = strtolower(trim($m['text']));
        $words = explode(' ', $mLower);
        foreach ($words as $w) {
            if ($w != "") {
                $word = trim($w, '.,?!');
                $topSent[] = $word;
            }
        }
    } else {
        $countReceiv++;
        $avgReceiv += $len;
    }
}

$getWord = array_count_values($topSent);
arsort($getWord);
$top5Sent = array_slice($getWord, 0, 5, true);

$avgSentNew = $countSent > 0 ? $avgSent / $countSent : 0;
$avgReceivNew = $countReceiv > 0 ? $avgReceiv / $countReceiv : 0;

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Analytics</title>
    <style>
        body {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, Helvetica, sans-serif;
        }

        .container {
            width: auto;
            height: auto;
            border-radius: 5px;
        }

        .grid-analytics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            background-color: #eeeeee;
            border-radius: 5px;
            padding: 10px;
        }

        .top-5 {
            justify-content: center;
            align-items: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="grid-analytics">
            <div><strong>Total Message sent : <?= $countSent ?></strong></div>
            <div><strong>Total Message received : <?= $countReceiv ?></strong></div>
            <div><strong>Average char length sent : <?= $avgSentNew ?></strong></div>
            <div><strong>Avarage char length received : <?= $avgReceivNew ?></strong></div>
        </div>
        <div class="top-5">
            <h2>Top 5 Sent Words</h2>
            <?php foreach ($top5Sent as $t => $count): ?>
                <div><strong><?= $t ?> = <?= $count ?></strong></div>
            <?php endforeach; ?>
        </div>
    </div>
</body>

</html>