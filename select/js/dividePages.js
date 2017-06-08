$(function(){
	function fromStartToEnd(alldata,pageNumber){
		/**每页的开头数字**/
		var startIndex = (pageNumber-1)*10;
		var everyPageData = alldata.slice(startIndex,startIndex+10);
		$("#data_body").empty();
		everyPageData.forEach(function(item,index){
			var $tr = $("<tr align='center'></tr>"); //表格的一行，在里面可以加各种属性;
			var $td = $("<td></td>"); //行中的元素  
			$tr.append($td.clone().text(item.large_Area));
			$tr.append($td.clone().text(item.sch_Name));
			$tr.append($td.clone().text(item.tea_Name));
			$tr.append($td.clone().text(item.role_Level));
			$tr.append($td.clone().text(item.cus_Name));
			$tr.append($td.clone().text(item.stu_Class));
			$tr.append($td.clone().text(item.peopleCount));
			$tr.append($td.clone().text(item.average));
			$tr.appendTo($("#data_body")); //别忘了最后要把内容放入前面的tbody  
		});
	}
	/**next>**/
	function clickNextArrow(allData){
		// 点亮按钮的下标
		var currentIndex = $(".pagination .numberBtn").index($(".active"))+1; // 1
		// 当前页码
		var page = parseInt($(".active").find(".labelA").html());
		
		$(".pagination .numberBtn").removeClass("active");
		$(".pagination .numberBtn").eq(currentIndex).addClass("active");
		if(page % 5 == 0){
			//更改li的值
			$(".numberBtn .labelA").each(function(index, item){
				//console.log($(item).html());
				if(index == 0){
					$(".pagination .numberBtn").removeClass("active");
					$(item).parent().addClass("active");
				}
				var beforeValue = parseInt($(item).html());
				$(item).html(beforeValue+5);
			});
		}
		// 更新表格数据
		// 要显示的页码为 page+1
		fromStartToEnd(allData, page+1);
		changePageNum();
	}
	/**previous**/
	function clickPreviousArrow(allData){
		// 点亮按钮的下标
		var currentIndex = $(".pagination .numberBtn").index($(".active"))-1; // 1
		// 当前页码
		var page = parseInt($(".active").find(".labelA").html());
		if(page <= 1){
			return;
		}
		$(".pagination .numberBtn").removeClass("active");
		$(".pagination .numberBtn").eq(currentIndex).addClass("active");
		if(page % 5 == 1){
			//更改li的值
			$(".numberBtn .labelA").each(function(index, item){
				//console.log($(item).html());
				if(index == 4){
					$(".pagination .numberBtn").removeClass("active");
					$(item).parent().addClass("active");
				}
				var beforeValue = parseInt($(item).html());
				$(item).html(beforeValue-5);	
			});
		}
		// 更新表格数据
		// 要显示的页码为 page+1
		fromStartToEnd(allData, page-1);
		changePageNum();
	}
	
	// 点击左右箭头的逻辑方法
	function clickPNextArrow(allData, type){
		var currentIndex = $(".pagination .numberBtn").index($(".active"))+type; // 1
		// 当前页码
		var page = parseInt($(".active").find(".labelA").html());
		if(page <= 1){
			return;
		}
		$(".pagination .numberBtn").removeClass("active");
		$(".pagination .numberBtn").eq(currentIndex).addClass("active");
		if(page % 5 == (type==-1)?0:1){
			//更改li的值
			$(".numberBtn .labelA").each(function(index, item){
				//console.log($(item).html());
				if(index == 4){
					$(".pagination .numberBtn").removeClass("active");
					$(item).parent().addClass("active");
				}
				var beforeValue = parseInt($(item).html());
				$(item).html(beforeValue-5);	
			});
		}
		// 更新表格数据
		// 要显示的页码为 page+1
		fromStartToEnd(allData, page-1);
	}
	
	var json = [];
	function page(form2){
		if (form2.startDate.value == "") { //验证用户名是否为空
			alert("请输入起始日期！");form2.startDate.focus();return false;
		}
		if (form2.endDate.value == "") { //验证密码是否为空
			alert("请输入结束日期！");form2.endDate.focus();return false;
		}
		var conditionData = {
			"largeArea" : document.getElementById('large_Area').value,
			"schName" : document.getElementById('sch_Name').value,
			"cusName" : document.getElementById('major').value,
			"role" : document.getElementById('teacherrole').value,
			"startDate" : document.getElementById('startDate').value,
			"endDate" : document.getElementById('endDate').value
		};
		
		$.getJSON("json/data.json",function(data){
			for(var i=0;i<12;i++){
				data.reverse();
				Array.prototype.push.apply(json, data);
			}
			
			if (json.length == 0) {
				alert("当前查询无结果！");
			} else {
				document.getElementById("exportss").style = "block";
			}
			$("#selectDiv").show();
			$("#exportss").show();
			$("#data_body").empty();
			//显示第一页内容
			fromStartToEnd(json,1);
		});
	}
	//page();
	
	$(".nextArrow").click(function(){
		clickNextArrow(json);
	});
	$(".previousArrow").click(function(){
		clickPreviousArrow(json);
	});
	$(".pagination .numberBtn").click(function(){
		/**按钮的颜色切换**/
		$(this).parents(".pagination").find("li").removeClass("active");
		$(this).addClass("active");
		/**页数按钮**/
		var pageNumber =$(this).find("a").html();
		fromStartToEnd(json,pageNumber);
		changePageNum();
	});
	
	/**点击确定按钮**/
	$(".pageBtn").click(function(){
		var inputNum = $(".pageAreaInp").val();
		if(!isPositiveNum(inputNum)){
			alert("请输入正整数");
			return;
		}
		// 左侧页面更新
		inputPageNum();
		// 页面数据更新
		showDataAccordingInpNumber(json);
		/**手动输入页码点击确定按钮，右侧页码点亮**/
		brightenNumAccordingInpNum();
	});
	
	
	/**取到点亮的页码数，改变页码输入区页数**/
	function changePageNum(){
		var innerTxt = $(".active").text();
		if(innerTxt<10&&innerTxt>0){
			$(".pageAreaNum").html("0"+innerTxt);
		}else{
			$(".pageAreaNum").html(innerTxt);
		}
		
	}
	/***手动输入的页面数***/
	function inputPageNum(){
		var inputNum = $(".pageAreaInp").val();
		if(inputNum<10&&inputNum>0){
			$(".pageAreaNum").html("0"+inputNum);
		}else{
			$(".pageAreaNum").html(inputNum);
		}
	}
	/**手动输入页码点击确定按钮，表格显示数据**/
	function showDataAccordingInpNumber(allData){
		var inputNum = $(".pageAreaInp").val();
		fromStartToEnd(allData, inputNum);
	}
	/*判断为正整数*/
	function isPositiveNum(s){//是否为正整数  
	    var re = /^[0-9]*[1-9][0-9]*$/ ;  
	    return re.test(s)  
	} 
	/**手动输入页码点击确定按钮，右侧页码点亮**/
	function brightenNumAccordingInpNum(allData){
		var inputNum = $(".pageAreaInp").val();
		inputNum = Number.parseInt(inputNum);
		// 计算右侧5个页面值的始终值
		var remainder = inputNum%5; // 余数
		var start = 1; // 开始
		var end = 5; // 结束
		if(remainder==0){
			var start = inputNum-4; // 开始
			var end = inputNum; // 结束
			//console.log(start+"-->"+end);
		}else{
			var start = inputNum-remainder+1; // 开始
			var end = inputNum+5-remainder; // 结束
			//console.log(start+"-->"+end);
		}
		
		$(".numberBtn .labelA").each(function(index, item){
			$(item).html(start+index);
			
			if((remainder==0&&index==4) || (remainder!=0&&index==remainder-1)){
				$(".pagination .numberBtn").removeClass("active");
				$(item).parent().addClass("active");
			}/*else if(remainder!=0&&index==remainder-1){
				$(".pagination .numberBtn").removeClass("active");
				$(item).parent().addClass("active");
			}*/
			
		});
	}
});
