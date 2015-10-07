document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {
    //結束程式，需要掛cordova.js
    $("#btn_exit").on("tap",function(){
        if (navigator.app) {
            navigator.app.exitApp();
        }
        else if (navigator.device) {
            navigator.device.exitApp();
        }
    });
	
	//AdMob的廣告
	admob.initAdmob("ca-app-pub-1234567890/1234","");//admob id
	var admobParam=new  admob.Params();
    admobParam.isTesting=true; //啟用admob的測試模式，以免點擊到自己的廣告
    admob.showBanner(admob.BannerSize.BANNER,admob.Position.BOTTOM_APP,admobParam);
    
}// TEST onDeviceReady()


    $( document ).ready(function () {  
 
        //預設參數
        var tnnTown = [      
            "新營區",  "鹽水區",  "白河區",  "柳營區",  "後壁區",
            "東山區",  "麻豆區",  "下營區",  "六甲區",  "官田區",
            "大內區",  "佳里區",  "學甲區",  "西港區",  "七股區",
            "將軍區",  "北門區",  "新化區",  "善化區",  "新市區",
            "安定區",  "山上區",  "玉井區",  "楠西區",  "南化區",
            "左鎮區",  "仁德區",  "歸仁區",  "關廟區",  "龍崎區",
            "永康區",  "東區",    "南區",    "北區",    "安南區",
            "安平區",  "中西區" ] ; 
            
        //var tnnTown = [ "新營區", "鹽水區", "白河區","柳營區",  "後壁區","東山區",  "麻豆區" ] ;  //測試6個區別
        
        var myTown = "仁德區" ;      
   
        QuickCheck() ; //快速選取                
        
        var data;
        var OpenData = new OpenData();
        OpenData.resourceID='bafe41e1-e703-42c6-a46c-ddb14923517e';
        OpenData.url='http://data.tainan.gov.tw/api/action/datastore_search';
        OpenData.limit=5000;
        for ( key in tnnTown ) {
            OpenData.q = tnnTown[key];
            var status = OpenData.ajax(); //ajax取得各區的資料
            if ( status == true ) {
                var peopletotal ;
                //確診人數
                if ( !OpenData.data.result.total ) {
                    peopletotal = 0 ;
                } else {
                    peopletotal = OpenData.data.result.total ;
                }
                $("#townlist").append('<li><a id="tnntown" href="#">' + tnnTown[key] + '</a><span class="ui-li-count">' 
                                       + peopletotal + '</span></li>');
                
            } else {
                alert("讀取資料失敗："+ OpenData.ajaxErr);
            }
        }    
        

        var map = new Map();
        $(document).on("tap","#area_query",function() {
            var tmp1 = "";
            for ( i=0 ; i< tnntown.length ; i++ ) {
                var tmp1 = tmp1 + '<li><a id="area_town" href="#">' + tnnTown[i] + '</a></li>';
            }
            $("#townlist_map").html(tmp1);
            $("#townlist_map").listview().listview("refresh"); //refresh才能重套樣式
        });    

        $(document).on("tap","#area_town",function() {
            console.log('this',$(this).text());
            $.mobile.pageContainer.pagecontainer("change", "#townmap_detail"); //改變Page
            map.Build($(this).text());           
        });        
        
        $(document).on("tap","#setuptown",function() {
            var tmp3 = '<form id="setuptowngroup"> <filedset data-role="controlgroup">' ;
            var tmp4 = localStorage.getItem('myTown');
            for ( key in tnnTown ) {
                if ( tmp4 == tnnTown[key] ) {
                    tmp3 = tmp3 + '<label><input type="radio" name="radiotown" checked="checked" value="' + tnnTown[key] +'">' +  tnnTown[key] +'</label>' ;
                } else {
                    tmp3 = tmp3 + '<label><input type="radio" name="radiotown"  value="' + tnnTown[key] +'">' +  tnnTown[key] +'</label>' ;
                }
            } 
            tmp3 = tmp3 + '<filedset></form>' ;
            $("#radiodiv").html(tmp3);
            $("#setuptowngroup").controlgroup().controlgroup('refresh');
            
        });
        
        $(document).on('tap','#entertown',function(){
            localStorage.setItem('myTown', $('input:radio:checked[name="radiotown"]').val());
            QuickCheck();
            $("#popup1").popup( "open" );
        });
        
        $(document).on('tap','#quick_check',function() {
            OpenData.q = $(this).text();
            var status = OpenData.ajax(); //ajax取得各區的資料
            if ( status == true ) {
                $.mobile.pageContainer.pagecontainer("change", "#query_detail"); //改變Page
                var townDetail = OpenData.data.result.records;
                var tmp2 ="";
                for ( key in townDetail ) {
                    var tmp1 = townDetail[key].確診日;
                    tmp2 = tmp2 + '<li>' + tmp1.substr(0,10) + " | " + townDetail[key].里別 + " | " +  townDetail[key].道路名稱 + '</li>';
                }
                $("#towndetaillist").html(tmp2);
                $("#towndetaillist").listview("refresh"); //refresh才能重套樣式
            }
        });
        
        $(document).on("tap","#tnntown",function() {
            OpenData.q = $(this).text();
            var status = OpenData.ajax(); //ajax取得各區的資料
            if ( status == true ) {
                $.mobile.pageContainer.pagecontainer("change", "#query_detail"); //改變Page
                var townDetail = OpenData.data.result.records;
                var tmp2 ="";
                for ( key in townDetail ) {
                    var tmp1 = townDetail[key].確診日;
                    tmp2 = tmp2 + '<li>' + tmp1.substr(0,10) + " | " + townDetail[key].里別 + " | " +  townDetail[key].道路名稱 + '</li>';
                }
                $("#towndetaillist").html(tmp2);
                $("#towndetaillist").listview("refresh"); //refresh才能重套樣式
            }
        });        
                
        
//---------------------------------- Function 宣告區 -----------------------------------   
        function QuickCheck() {
            //快速選取
            if ( localStorage.getItem('myTown') != "" || localStorage.getItem('myTown') != 'undefined') {
                myTown = localStorage.getItem('myTown');
                $("#quick_check").html(myTown);
            }
        } //End QuickCheck();


        //地圖函數
        function Map() {
            this.Build = function(town) {
                var fileCode = 't' + (Number(tnnTown.indexOf(town)) + 1) ;
                var fileName = 'map/' + fileCode + '.json' ;             
                                
                d3.json(fileName,function(topodata) {           

                    var color = d3.scale.linear().domain([100,250]).range(["#050","#f10"]);                
                    var t1 = topojson.feature(topodata, topodata.objects[fileCode]).features; 
                    var t2 = topojson.feature(topodata, topodata.objects[fileCode]);
                                   
                    
                    var center = d3.geo.centroid(t2); //取得center座標                    
                    var scale =150000 ;
                    var width = $(window).width();
                    var height = $(window).height() -120;
                    var offset = [width/2, height/2];
                    var geoConf =  d3.geo.mercator()
                                     .center(center)
                                     .scale(scale)
                                     .translate(offset);                                                          
                         
                    var path1 = d3.geo.path().projection(geoConf); //create the path                    
                
                    //using the path determine the bounds of the current map
                    var bounds  = path1.bounds(t2); 
                    var hscale  = scale*(width)  / (bounds[1][0] - bounds[0][0]);
                    var vscale  = scale*(height) / (bounds[1][1] - bounds[0][1]);
                    var scale   = (hscale < vscale) ? hscale : vscale;
                    var offset  = [width - (bounds[0][0] + bounds[1][0])/2+5,
                                   height - (bounds[0][1] + bounds[1][1])/2+30]; 
                             
                                     
                    //new geoConf
                    var geoConf =  d3.geo.mercator()
                                     .center(center)
                                     .scale(scale)
                                     .translate(offset);         
                    var path1 = d3.geo.path().projection(geoConf); //create the path  
                    
			        //繪製地圖
                    d3.select("#svg1").remove(); 
                    $("#svg_area").append("<svg id='svg1'></svg>")               
                    d3.select("#svg1").selectAll("path")
				      .data(t1)
                      .enter()
				      .append("path")
				      .attr({d: path1,
                             fill: function(d) {
						               /*for ( i = 0 ; i < json_data.length ; i++ ) {
						                     if ( d.properties.TOWN == json_data[i] ) {
							                     console.log('yyyy');
						                     }
						               }*/
                                       return color(Math.random()*100);
                                   }
                           });   
                           
                    //OpenData
                    OpenData.q = town;
                    var status = OpenData.ajax(); //ajax取得各區的資料
                    if ( status == true ) {
                        var townDetail = OpenData.data.result.records;                                
                        for ( key in townDetail ) {
                            var path2 = geoConf([townDetail[key].經度座標,townDetail[key].緯度座標]); 
                            d3.select("#svg1")                      
                              .append('circle')
                              .attr('cx', path2[0])
                              .attr('cy', path2[1])
                              .attr('r', 2)
                              .attr('fill','#A05');                            
                        }
                    }
		        });                
            } //End Build()
        } //End Map()
        
        //取得政府opendata的資料
        function OpenData() {
            this.q = "" ;
            this.resourceID;
            this.url;
            this.limit = 1000;
            this.ajaxTimeout = 15000 ; //預設15秒
            this.data ;
            this.ajaxErr = " ";
            this.ajax = function() {
                var status = true;
                var query = "resource_id=" + this.resourceID;
                if ( !this.resourceID || this.resourceID == null) {
                    status = false;
                    OpenData.ajaxErr = 'resourceID is undefined or null' ;
                } else {
                    if ( this.q || this.q != null ) {
                        query = query + "&q=" + this.q ;
                        status = true;
                    }
                    if ( this.limit || this.limit != null ) {
                        query = query + "&limit=" + this.limit ;
                        status = true;
                    }
                }
                
                if ( status == true ) {
                    $.ajax({
                        url: this.url,
                        data: query,
                        timeout:this.ajaxTimeout,  //指定時間無回應 即為error
                        async:false,  //啟用同步，在ajax取資料過程中，ajax外的程式碼無法執行
                        error: function(err) {
                            status = false;
                            OpenData.ajaxErr = 'ajax error: ' + err;
                        },
                        success: function(data) {
                            OpenData.data = data;
                            status=true;
                        }            
                    });
                }
                return status;
            }                
        } //End _OpenData        
//------------------------------------ End Function 宣告區 --------------------------
    
    }); //End $( document ).ready
    
//} //End onDeviceReady










//-------------------------------------------------------------------------------
//------------------------------TEST程式碼專區-----------------------------------
//-------------------------------------------------------------------------------

//var tt1 =1;
//if ( tt1 || tt1 != null )  { alert('tt'); }


/*var test1;
$.ajax({
            url: "http://data.tainan.gov.tw/api/action/datastore_search",
            data: 'resource_id=fb2e5df8-d5dc-42d6-9fc2-8d638205a7aa&limit=5',
            async:false,
            //dataType: 'POST',
            error: function(err) {
                console.log("錯誤",err);
            },
            success: function(data) {
                //console.log('TEST專區..data',data);
                test1 = data;
            }                      
        });       
console.log('test1',test1);
*/


//查詢local storage size
        /*
        var total = 0;
        for(var x in localStorage) {
            var amount = (localStorage[x].length * 2) / 1024 / 1024;
            total += amount;
            console.log( x + " = " + amount.toFixed(2) + " MB");
        }
        console.log( "Total: " + total.toFixed(2) + " MB");
        */
        
/*var status = OpenData.ajax();
        if ( status == true ) {
            var dataToStore = JSON.stringify(OpenData.dengueData.result);
            localStorage.setItem('DataJSON', dataToStore);
            console.log(JSON.parse(localStorage.getItem('DataJSON')));
            var today = new Date();
            //getMonth是從0開始，0代表一月
            $("#data_check").html("資料更新日：" +  today.getFullYear() + "/" + (today.getMonth()+1) + "/" + today.getDate());             
        }*/
       
      

//繪製地圖
/*d3.select("#svg2").selectAll("circle")
    //.data({ "x": 120.234, "y": 22.987, "r": 200, "color" : "red" })
    .data({ "x": 150, "y": 150, "r": 20, "color" : "red" })
    .enter()
    .append("circle")
    .attr({
        cx: function(d) { return d.x; }, // 用 x,y 當圓心
        cy: function(it) { return it.y; },
        r : function(it) { return it.r; }, // 用 r 當半徑
        fill: "#ccc",                      // 填滿亮灰色
        stroke: "#444"                  // 邊框畫深灰色
    });*/
    
    
 /*d3.select('#svg2')
    .append('circle')
    .attr({
        'cx':20,
        'cy':20,
        'r':50,
        'fill':'#f90',
        'stroke':'#c00',
        'stroke-width':'5px'
    });*/


