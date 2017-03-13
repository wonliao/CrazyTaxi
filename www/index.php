<?php
/*
https://go2gether.tw/index.php?
dest=台中榮總&start_time=201702140830&memo=早診&job=台中榮總共乘
&utm_source=vghtc&utm_campaign=vghtc_register&utm_medium=app
*/
$dest = $_GET['dest'];
$start_time = $_GET['start_time'];
$memo = $_GET['memo'];
$job = $_GET['job'];
?>
<script type="text/javascript">

    console.log("dest", "<?php echo $dest; ?>");

    //window.localStorage.clear();
    window.localStorage.setItem("f1", "<?php echo $dest; ?>");
    window.localStorage.setItem("f2", "<?php echo $start_time; ?>");
    window.localStorage.setItem("f3", "<?php echo $memo; ?>");
    window.localStorage.setItem("f4", "<?php echo $job; ?>");

    location.href = "./";

</script>

