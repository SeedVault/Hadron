<html>
<head>
  <title>Hadron</title>
  <style>
	body {
		background: #dcdde0;
	}
  </style>
</head>
<body>

<?php
/*
 These files are made available to you on an as-is and restricted basis, and may only be redistributed or sold to any third party as expressly indicated in the Terms of Use for Seed Vault.
 Seed Vault Code (c) Botanic Technologies, Inc. Used under license.
*/

  $span = '<span class="hadron-button quark" ';

  $params = $_GET;
  foreach ($params as $paramName => $paramValue) {
    $paramValue = urlencode($paramValue);

    $new_param = preg_replace('/(?<=\\w)(?=[A-Z])/',"-$1", $paramName);
    $new_param = strtolower($new_param);

    $span .= "data-{$new_param}=\"{$paramValue}\" ";
  }

  $span .= "</span>";

  echo $span;
?>

<script src="./hadron.js?ts=<?php echo microtime(true);?>"></script>

</body>
</html>
