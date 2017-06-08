$(function(){
	
	
	
	// 折线图
	// 获取json数据
	$.getJSON('json/zxdata.json',function(res){
		if(res.code == 200){
			// series数据组装
			var ser = res.result.series;
			var series = [];
			for(var i=0;i<ser.length;i++){
				var item = {
					name: res.result.legend.data[i],
					type: 'line',
					data: res.result.series[i].data
				};
				series[i] = item;
			}
			// 指定图表的配置项和数据
			var option = {
	            title: {
	                text : res.result.title,
	            },
	            tooltip: {
			       trigger: 'item'
			    },
	           
	            legend:res.result.legend, //显示数据的名称
	            xAxis: res.result.xAxis,
	            yAxis: {   
			        type: 'value',
			       
			    },
	            series: series
        	};
        	
        	echart(option);
        	
		}else{
			alert("数据请求失败");
		}
	});
	function echart(option){
		var myChart = echarts.init(document.getElementById('main'));
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option);
        //点击折现图时，雷达图出现
        myChart.on('click', function (params) {
		    	console.log(params);
		    	
		    
		});
	}
	
	/**雷达图**/
	// 获取json数据
	$.getJSON('json/radarData.json',function(response){
		if(response.code == 200){
			//获取10个维度的text
			var indicatorArray = response.result.indicator;
			var indicator=[];
			for(var i = 0;i<indicatorArray.length;i++){
				var tenItems = {
					    text :indicatorArray[i],
						max  : 100
				};
				indicator[i] = tenItems;
			}
			//获取title的text
			
			var radarOption ={
        		title : {
			        text: response.result.bigArea+"-"+response.result.school+"-"+response.result.titleName
			        
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        x : 'center',
			        data:['罗纳尔多','舍普琴科']
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            restore : {show: true},
			           /* saveAsImage : {show: true}*/
			        }
			    },
			    calculable : true,
			    polar : [
			        {
			            indicator : indicator, //十项标准
			         	radius : 130
			        }
			    ],
			    series : [
			        {
			            name: '完全实况球员数据',
			            type: 'radar',
			            
			            itemStyle: {
			                normal: {
			                	color: {
								    type: 'linear',
								    x: 0,
								    y: 0,
								    x2: 0,
								    y2: 1,
								    colorStops: [
								    {
								        offset: 0, color: 'pink' // 0% 处的颜色
								    },
								    {
								        offset: 1, color: 'orange' // 100% 处的颜色
								    }],
								    globalCoord: false // 缺省为 false
								},
								borderColor: '#000',
			                    areaStyle: {
			                        type: 'default'
			                    }
			                    
			                }
			            },
			            data : [
			                {
			                    value : [97, 42, 88, 94, 90, 86,100,20,20,30],
			                   /* name : '舍普琴科'*/
			                }
			                
			            ]
			        }
			    ]
			};
        	
        	radarChart(radarOption)
		}else{
			alert("数据请求失败");
		}
	});
	
	function radarChart(radarOption){
		var radarChart = echarts.init(document.getElementById('radarChart'));
		radarChart.setOption(radarOption);
	}
});
