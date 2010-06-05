<?php

$mysql = mysqli_connect("localhost","root","m8db","lnmm_blog");

if(!isset($_COOKIE['ses'])){
  $session_key = md5(json_encode(getallheaders()));
  setcookie('ses',$session_key);
}else{
  $session_key = $_COOKIE['ses'];
}

$mem = new Memcached();
$mem->addServer("localhost",11211);

$user_id = $mem->get($session_key . "-user-id");

if($user_id && is_numeric($user_id)){
  $result = $mysql->query("select * from users where user_id = " . $user_id);
  $user = $result->fetchObject();
  $username = $user->name;
}else{
  $username = "Guest";
}

$result = $mysql->query("select * from articles order by time_created desc limit 10");
$articles = array();
while($article = $result->fetch_array()){
  $articles[] = $article;
}
include("template.tpl");
