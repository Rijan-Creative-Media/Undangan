<?php
$SOURCE = "https://rijan-creative-media.github.io/Undangan/";
$request = $_SERVER['REQUEST_URI'];
$viewDir = '/views/';

function get_content($URL) {
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_URL, $URL);
      $data = curl_exec($ch);
      $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      $type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
      curl_close($ch);
      return ["data"=>$data,"status"=>$http_code,"type"=>$type];
}

switch ($request) {
    case '/comment':
        require __DIR__ . '/comment.php';
        break;
    case '/':
    default:
        $res = get_content($SOURCE . $request);
        if ($res["status"] == 200) {
            if (!empty($res["type"])) {
                header("Content-Type: ".$res["type"]);
            }
            echo $res["data"];
        } else {
            http_response_code(404);
            echo "Not Found " . $request;
        }
}
