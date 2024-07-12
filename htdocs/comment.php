<?php
$conn = new mysqli("", "", "", "");

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

function resJSON($status, $content) {
    $data = array("status" => $status);
    if ($status) {
        $data["result"] = $content;
    } else {
        $data["message"] = $content;
    }
    echo json_encode($data);
}

function check($name) {
    if (empty($_POST[$name])) {
        http_response_code(401);
        resJSON(false, "'".$name."' parameter is empty");
        return true;
    } else {
        return false;
    }
}

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!(check("name") || check("attendance") || check("greet"))) {
        $name = $conn->real_escape_string($_POST['name']);
        $attendance = $conn->real_escape_string($_POST['attendance']);
        $text = $conn->real_escape_string($_POST['greet']);
        $sql = "INSERT INTO guestbook (name, attendance, text)
        VALUES ('".$name."', '".$attendance."', '".$text."')";
        if ($conn->query($sql) === TRUE) {
            resJSON(true, "Successfully added to database");
        } else {
            resJSON(false, "Error: ".$conn->error);
        }
    }
} else {
    $sql = "SELECT name, attendance, text, date FROM guestbook";
    $result = $conn->query($sql);
    $results = array();
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $results[] = array("n" => $row["name"], "a" => $row["attendance"], "t" => $row["text"], "d" => $row["date"]);
        }
    }
    echo json_encode($results);
}
?>