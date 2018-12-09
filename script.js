$(function(){

	// Convert current time to my original Time Stamp ==============================

	function getCurrentTime(){

		var T = new Date();
		$("#str").text(T);
		T = $("#str").text();
		$("#str").remove();
		var H = parseInt(T.slice(16,18));
		var M = parseInt(T.slice(19,21));
		var S = parseInt(T.slice(22,24));
		r = (H>3)? ((H-3)*60*60)+(M*60)+S : ((H+21)*60*60)+(M*60)+S;
		return r;

	}

	// Convert "hhmm" to my original Time Stamp ==============================

	function CTS(T){

		var H = parseInt(T.slice(0,2));
		var M = parseInt(T.slice(2,4));
		r = (H>3)? ((H-3)*60*60)+(M*60) : ((H+21)*60*60)+(M*60);
		return r;

	}

	// Convert my original Time Stamp to "h:mm" ==============================

	function CTS2(T){
		if(isNaN(T)){
			return "end";
		}else{
			var H = String(Math.floor(T/(60*60))+3);
			var M = String(Math.floor(T%(60*60)/60));
			M = (M.length >= 2)? M : "0" + M;
			r = H + ":" + M;
			return r;
		}

	}

	// Convert my original Time Stamp to "h:m:ss" ==============================

	function CTS3(T){
		if(isNaN(T)){
			return "--";
		}else{
			var H = String(Math.floor(T/(60*60)));
			var M = String(Math.floor(T%(60*60)/60));
			var S = String(Math.floor(T%60));
			S = ( S.length>=2 )? S : "0" + S;
			r = ( H==0 )? "" :  H+"h.";
			r += ( M==0 )? "" : M+"min.";
			r += ( M>=5 || H>=1 )? "" : S+"s";
			return r;
		}

	}

	//=======================================================================
	// Main function (Page call this function at first.)
	//=======================================================================

	(function(){

	    $.get("timeTable.json",$.noop,'json').done(function(data){
			var tObj = data;
			var max_i = tObj.length;
			var eTime = []; //estimated time
			var rTime = []; //the rest of time
			var str;
			
			// What time is it now? ==============================

			cTime = getCurrentTime();

			// Initialize HTML ==============================

			for (var i=0; i<max_i ;i++){
				if (i!=0){
					$(".contentsDiv:first").clone(true).appendTo("#mainDiv");
				}
				str = tObj[i].stationName;
				$(".st-name").eq(i).text(str);
				str = tObj[i].lineName;
				$(".line-name").eq(i).text(str);
				str = tObj[i].themeColor;
				$(".line-color").eq(i).css("background-color",str);
				$(".line-name").eq(i).css("color",str);
			}

			// Search estimated time of next train ==============================

			for (var i=0; i<max_i ;i++){
				eTime[i]= new Array(1); 
				rTime[i]= new Array(1); 

				var max_j = tObj[i].times.length;
				for (var j=0; j<max_j ;j++){
					str = CTS(tObj[i].times[j]+" ");
					if (str > cTime){
						eTime[i][0] = str
						rTime[i][0] = str - cTime;
						eTime[i][1] = CTS(tObj[i].times[j+1]+" ");
						rTime[i][1] = eTime[i][1] - cTime;
						break;
					}
				}
			}
			
			for (var i=0; i<max_i ;i++){
				$(".0-eTime").eq(i).text(CTS2(eTime[i][0]));
				$(".1-eTime").eq(i).text(CTS2(eTime[i][1]));	
			}

			// Timer function ==============================

			function refreshTable(){
				for (var i=0; i<max_i ;i++){
					rTime[i][0] -= 1;
					rTime[i][1] -= 1;
					if (rTime[i][0]<=0){
						location.reload();
						break;
					} else if(rTime[i][0]<=60){
						$(".0-header").eq(i).removeClass("c-1").addClass("c-very-soon");
						$(".0-eTime").eq(i).removeClass("c-1").addClass("c-very-soon");
						$(".0-rTime").eq(i).removeClass("c-1").addClass("c-very-soon");
					} else if(rTime[i][0]<=180){
						$(".0-header").eq(i).removeClass("c-1").addClass("c-soon");
						$(".0-eTime").eq(i).removeClass("c-1").addClass("c-soon");
						$(".0-rTime").eq(i).removeClass("c-1").addClass("c-soon");
					}
					$(".0-rTime").eq(i).text(CTS3(rTime[i][0]));
					$(".1-rTime").eq(i).text(CTS3(rTime[i][1]));
				}
			}

			refreshTable();

			setInterval(function(){
				refreshTable();
			},1000);

    	});

	})();
});
