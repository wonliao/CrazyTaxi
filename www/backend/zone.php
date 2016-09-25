<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>ZONE免費電話點數500點</title>

<script src="js/jquery.min.js"></script>
<script src="js/handsontable.full.js"></script>
<script src="js/jquery.handsontable.csv.js"></script>

<link rel="stylesheet" media="screen" href="css/handsontable.full.css">

</head>

<body>

<div style="position:fixed; top:0; height:50px; z-index:999;">
    <button id="btnUpdate" style="margin-top:8px">儲存</button>
</div>

<div style="padding-left:50px">
    <label style="color:#000; margin:5px;">搜尋：</label><input id="searchgrid" type="text" />
    <br />
    <br />
    <div id="hot"></div>
</div>

<?php

//ini_set('display_errors',1);
require_once('./link.php');

mysql_select_db($news, $link);

mysql_query("SET NAMES 'utf8'");
mysql_query("SET CHARACTER_SET_CLIENT='utf8'");
mysql_query("SET CHARACTER_SET_RESULTS='utf8'");

$table_ids = array();
$campaign_id = $_GET['campaign_id'];



?>

<script type="text/javascript">

var renderState = false;
//var campaign_id = parseInt("<?php echo $campaign_id; ?>");
var event_name = "zone";
var noOfRowstoShow = 2000;	// 搜尋結果筆數


var searchFiled = document.getElementById('search_field');
var $container = $("#hot");
$container.handsontable({
	maxCols: 4,
	rowHeaders: true,
	colHeaders: true,
	minSpareRows: 1,
	contextMenu: true,
	colWidths: [1, 300, 300, 300],
	columnSorting: true,
	colHeaders: ["index", "活動序號", "領取者fb id", "領取時間"],
	search: true,
	className: "htCenter",
	columns: [
		{},
		{},
		{},
		{}
	],
	//afterChange: saveChange,
	//afterCreateRow: createRow,
	//beforeRemoveRow: removeRow
	//allowRemoveRow: false
});

var hotInstance = $("#hot").handsontable('getInstance');
var myData;
function tableLoadData() {

	$.post("report_db.php", 
		{ 
			"action": "get",
			"event_name":	event_name
		}, function(res){

			//console.log("data("+res.data+")");

			myData = res.data;
			hotInstance.loadData(res.data);
			
			renderState = true;
		},
		"json"
	);
}
tableLoadData();


$("#btnUpdate").click(function () {
	
    var tableData = JSON.stringify(hotInstance.getData());
    //console.log("tableData("+tableData+")");

	$.post("report_db.php", 
		{
			"action": "save",
			"event_name":	event_name,
			"data": tableData
		}, function(res){

			console.log("res("+res+")");
		}
	);

    $("btnUpdate").blur();
});


$("#btnExport").click(function(e) {

	//handsontable2csv.download(hotInstance, "filename.csv");	

	$.post("report_excel.php", 
		{ 
			"action": "get_store",
			"campaign_id":	campaign_id
		}, function(res){
			
			//console.log(res);
			downloadURI("http://<?php echo $_SERVER['HTTP_HOST']; ?>/indexplates/boscogen/reports/boscogen_store.xls", "boscogen_store.xls");
		}
	);
});

function downloadURI(uri, name) 
{
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}


// 搜尋
$('#searchgrid').on('keyup', function (event) {
    var value = ('' + this.value).toLowerCase(), row, col, r_len, c_len, td;
    //var example = $('#exampleGrid');
    var data = myData;
    var searcharray = [];
    if (value) {
        for (row = 0, r_len = data.length; row < r_len; row++) {
            for (col = 0, c_len = data[row].length; col < c_len; col++) {
                if (data[row][col] == null) {
                    continue;
                }
                if (('' + data[row][col]).toLowerCase().indexOf(value) > -1) {
                    searcharray.push(data[row]);
                    break;
                }
                else {
                }
            }
        }
        getgridData(searcharray, "1", noOfRowstoShow);
    }
    else {
        getgridData(myData, "1", noOfRowstoShow);
    }
});

function getgridData(res, hash, noOfRowstoShow) {

    var page = parseInt(hash.replace('#', ''), 10) || 1, limit = noOfRowstoShow, row = (page - 1) * limit, count = page * limit, part = [];

    for (; row < count; row++) {
        if (res[row] != null) {
            part.push(res[row]);
        }
    }

    var pages = Math.ceil(res.length / noOfRowstoShow);
    $('#gridpage').empty();
    for (var i = 1; i <= pages; i++) {
        var element = $("<a href='#" + i + "'>" + i + "</a>");
        element.bind('click', function (e) {
            var hash = e.currentTarget.attributes[0].nodeValue;
            $("#hot").handsontable('loadData', getgridData(res, hash, noOfRowstoShow));
        });
        $('#gridpage').append(element);
    }
    $("#hot").handsontable('loadData', part);
    return part;
}


function saveChange(change, source) {

	if (source != 'loadData') {

		console.log("afterChange ==> source("+source+") change("+change+")");	
		saveChangeToDB(change);
	}
}

function createRow(index, amount) {

	if(renderState == true) {

		console.log("afterCreateRow ==> index("+index+") amount("+amount+")");
		renderState = false;
		insertToDB(index, amount);
	}
}

function removeRow(index, amount) {

	//console.log("afterRemoveRow ==> index("+index+") amount("+amount+")");
	var ids = new Array();
	for(var i=0; i<amount; i++) {
		
		var row = index + i;
		var id = String(hotInstance.getData(row, 0, row, 0));
		//var campaign_id = String(hotInstance.getData(row, 1, row, 1));
		console.log("index("+index+") i("+i+") row("+row+") campaign_id("+campaign_id+") id("+id+")");
		
		ids.push(id);
	}

	var ids_str = ids.toString();
	console.log("ids_str("+ids_str+")("+ids_str.length+")");
	if(ids_str.length > 0) {

		$.post("report_db.php",
			{ 
				"action": "remove_store",
				"ids_str": ids_str
			},
			function(res){
	
				console.log(res);
				//console.log("data("+res.data+")");
			},
			"json"
		);
	}
}


function saveChangeToDB(change) {

	var str = String(change);
	var words = str.split(',');
	//console.log("saveChangeToDB ==> change("+change+") words("+words[0]+") length("+words.length+")");
	
	for(var i=0; i<words.length/4; i++) {
	
		var index = i * 4;
		
		var row = words[index];
		var col = words[index+1];
		//var old_str = words[2];
		var new_str = words[index+3];
		console.log("col("+col+") row("+row+") new_str("+new_str+")");
		
		var id = String(hotInstance.getData(row, 0, row, 0));
		//var liveplates_id = String(hotInstance.getData(row, 3, row, 3));
		//var campaign_id = "<?php echo $campaign_id; ?>"; //String(hotInstance.getData(row, 1, row, 1));
		console.log("id("+id+") campaign_id("+campaign_id+") col("+col+") new_str("+new_str+")");
	
		$.post("report_db.php", 
			{ 
				"action": "save_store",
				"id": id,
				"campaign_id": campaign_id,
				"col": col,
				"value": new_str
			},
			function(res){
	
				console.log(res);
				//console.log("data("+res.data+")");
			},
			"json"
		);
	
	}
}


function insertToDB(index, amount) {
	
	console.log("insertToDB ==> index("+index+") amount("+amount+")");

	// async: false 是為了同步等待 id
	$.ajax({
		async: false,
		type: "POST",
		url: "report_db.php",
		dataType : 'json',
		data: {
			"action": "insert_store",
			"campaign_id": campaign_id,
			"index": index,
			"amount": amount
		},
		success : function(res) {

			console.log(res);
			var id = res.data;
			hotInstance.setDataAtCell(index-1, 0, id, 'loadData');
			//tableLoadData();
			//location.reload();
		}
	});
}
</script>


</body>
</html>