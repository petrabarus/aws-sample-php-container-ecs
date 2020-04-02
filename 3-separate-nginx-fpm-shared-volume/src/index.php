<?php


$random = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', mt_rand(1,10))), 1, 10);

copy(__DIR__ . '/imageasset.jpg', "/tmp/assets/{$random}.jpg");

echo <<<HTML
Hello, App 3! Here we have nginx and fpm in
different containers shared local storage. <br/>

Showing file from /assets/{$random}.jpg <br/>

<img style="height:256px;width:256px;" src="/assets/{$random}.jpg"/>
HTML
;
