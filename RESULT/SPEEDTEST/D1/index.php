<?php
  $en = json_decode(file_get_contents('lang/en_EN.json'), true);
  $id = json_decode(file_get_contents('lang/id_ID.json'), true);
  $nl = json_decode(file_get_contents('lang/nl_NL.json'), true);

  $lang = $en;
  $langs = isset($_POST['lang']) ? $_POST['lang'] : $en;
  if ($langs === "id") {
    $lang = $id;
  }
  elseif ($langs === "dutch") {
    $lang = $nl;
  }
?>


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Multilingual</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <nav class="navbar">
      <div class="container">
        <div class="logo">
          <h1>I18N</h1>
        </div>
        <ul>
          <li><a href="#"><?= $lang['home'] ?></a></li>
          <li><a href="#"><?= $lang['about_us'] ?></a></li>
          <li><a href="#"><?= $lang['contact_us'] ?></a></li>
          <li><a href="#"><?= $lang['register'] ?></a></li>
          <li><a href="#"><?= $lang['login'] ?></a></li>
          <li class="language-form">
            <form action="" method="post" id="form">
            <select name="lang" id="lang" onchange="submit()">
              <option value="en" <?php 
                  if (isset($_POST['lang'])) {
                    echo $_POST['lang'] === "en" ? "selected" : "";
                  } 
  ?>>English</option>
              <option value="id" <?php 
                  if (isset($_POST['lang'])) {
                    echo $_POST['lang'] === "id" ? "selected" : "";
                  } 
  ?>>Indonesia</option>
              <option value="dutch" <?php 
                  if (isset($_POST['lang'])) {
                    echo $_POST['lang'] === "dutch" ? "selected" : "";
                  } 
  ?>>Dutch</option>
            </select>
            </form>
          </li>
        </ul>
      </div>
    </nav>

    <article class="article-section">
      <div class="container">
        <h1 class="article-title">
          Multilingual Digital Platform for All
        </h1>
        <div class="article-content">
          <p><?= $lang['content_1'] ?>
          </p>	
          <p>
            <center><img src="img/images.png" alt="multibahasa" width="450"></center>
          </p>
          <p><?= $lang['content_2'] ?>
          </p>
        </div>
      </div>
    </article>

    <footer>
      <div class="container">
        <div class="copyright">Copyright &copy; 2026</div>
      </div>
    </footer>

    <script>
      function submit() {
        document.getElementById('form').submit();
      }
    </script>
  </body>
</html>
