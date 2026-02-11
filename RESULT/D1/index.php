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
              <option value="en" <?= $_POST['lang'] === "en" ? "selected" : "" ?>>English</option>
              <option value="id" <?= $_POST['lang'] === "id" ? "selected" : "" ?>>Indonesia</option>
              <option value="dutch" <?= $_POST['lang'] === "dutch" ? "selected" : "" ?>>Dutch</option>
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
          <p>
            The website has been equipped with a multilingual feature, allowing users to easily switch languages according to their needs. 
            Simply by clicking the available language selection button, all content on the website will automatically adjust to the selected language. 
            This feature is designed to provide a more comfortable, flexible, and inclusive user experience for users from diverse linguistic backgrounds.
          </p>	
          <p>
            <center><img src="img/images.png" alt="multibahasa" width="450"></center>
          </p>
          <p>
            With this multilingual feature, users can access all information, read articles, and use every service available on the website without language barriers. 
            Every content element—ranging from menus and buttons to informational messages—is displayed consistently and accurately according to the selected language. 
            This not only enhances user convenience but also expands the website’s reach, enabling it to serve a wider audience both domestically and internationally.
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
