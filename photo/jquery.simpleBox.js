(function($){
	 $.fn.simpleBox = function(){

		var now_img_num = 0;	// 現在の表示画像
		var max_img_num = 0;
		
		var link_color_default = "#cccccc";
		var link_color_click = "#9999ff";
	 	
	 	
	 	
		// パネルの表示サイズを取得
		var panelSize = $("#carouselInner").width();

		// 初期表示
		// 写真を全て横に並べた場合の横幅を算出して設定
		$("#carouselInner").css("width", panelSize*$("#carouselInner ul.column").size() + "px");
		// 最後の写真を先頭に移動
		$("#carouselInner ul.column:last").prependTo("#carouselInner");
		// 先頭に移動した写真を左方向にずらす(画面の外に置いて見えなくする)
		$("#carouselInner").css("margin-left","-" + panelSize + "px");

		// 画像遷移リンクを作成
		for (var i=0; i<$("#carouselInner ul.column").size(); i++) {
			//$move = $("#move_link").append('<span class="img_link link_kind_'+i+'" id="'+i+'">●</span>');
			
			
			$move = $('<span class="img_link link_kind_'+i+'" id="'+i+'">●</span>').appendTo("#move_link")
			
			
			
			$move.css("text-align", "center");
			$move.css("margin", "5px");
			if(i == 0){
				// 0番目を初期表示にする
				$move.css("color", link_color_click);
			}
			else{
				$move.css("color", link_color_default);
			}
		}

		var all_size = $("#carouselInner ul.column").size();
		var max_size = all_size * 510;
		// 画面に表示する最大画像数
		max_img_num = $("#carouselInner ul.column").size() - 1;

		$(".img_link").click(function(){
			// クリックされた●のidを取得
			var click_id = parseInt($(this).attr("id"));
			
			var move_count = 0;
			move_count = click_id - now_img_num;

			// 画像の移動が発生した場合の処理
			if(move_count !== 0){
				// ●の色を変更
				$(".img_link").css("color", link_color_default);
				$(".link_kind_" + click_id ).css("color", link_color_click);
				
				// 移動するサイズを算出する
				var move_size = (-move_count * panelSize) - panelSize ;

				// 現在表示されている画像の番号を保持する
				now_img_num += move_count;
				if (now_img_num < 0) {
					now_img_num = max_img_num;
				} else if (now_img_num > max_img_num){
					now_img_num = 0;
				}
				
				// 最後の画像を表示したい場合
				if(click_id == max_img_num){
					// 最後の画像は初期設定では1番前に表示されている為、最後にも複製して表示する
					$("#carouselInner").css("width", panelSize*$("#carouselInner ul.column").size()+panelSize + "px");
					$("#carouselInner ul.column:first").clone(true).appendTo("#carouselInner");
				}

				// 前に戻る場合
				if(move_count < -1){
					var add_count = 0;
					$("#carouselInner").css("width", panelSize*$("#carouselInner ul.column").size()+panelSize + "px");
					for(var i=0; i>move_count; i--){
						// 戻る分だけ、後ろに表示されている画像を前へ持ってくる
						$("#carouselInner ul.column:last").clone(true).prependTo("#carouselInner");
						if(move_count < -1 ){
							// 2つ以上戻る場合、余分な画像を削除
							$("#carouselInner ul.column:last").remove();
						}
						add_count++;
					}
					// 2つ以上戻る場合
					if(move_count < -1 ){
						// 移動開始位置に自分自身がなくなってしまう為、一時的に複製(移動完了後に削除)
						$("#carouselInner ul.column:first").clone(true).appendTo("#carouselInner");
					}
					
					// 現在の左の余白
					var now_left_margin = parseInt($("#carouselInner").css("margin-left"));
					// 後ろから前へ移動した分余白を修正する
					var tmp = now_left_margin - (panelSize * add_count);

					$("#carouselInner").css("margin-left", tmp + "px");
					// 移動サイズの修正
					move_size = move_size - (panelSize * add_count);
				}
			
				$("#carouselInner").animate({
					marginLeft : (move_size)+"px"
					
				},"slow","swing" , 
				function(){
					$("#carouselInner").css("margin-left","-" + panelSize + "px")
					if (move_count > 0) {
						// 最後の画像を表示したい場合
						if(click_id == max_img_num){
							// スライドする際、最後の画像を複製しているので、複製元の画像を削除し初期設定に戻す
							$("#carouselInner ul.column:first").remove();
							$("#carouselInner").css("width", panelSize*$("#carouselInner ul.column").size() + "px");
							// 複製元の画像を削除している為、移動を少なくする
							move_count = move_count-1;
						}
						
						for(var i=0; i<move_count; i++){
							$("#carouselInner ul.column:first").appendTo("#carouselInner");
						}

					} else {
						if(move_count == -1){
							// 1つ戻る場合
							$("#carouselInner ul.column:last").prependTo("#carouselInner");
						}else{
							// 2つ以上戻る場合、自分自身を表示する為に一時的に複製した画像を削除する
							$("#carouselInner ul.column:last").remove();
						}
					}
					$("#carouselNext,#carouselPrev").show();
				})
			}
		})

		// 戻るボタン
		$("#carouselPrev").click(function(){
			// 戻る、進むボタンを一時的に非表示にして押せなくする
			$("#carouselNext,#carouselPrev").hide();
			
			// 現在表示されている画像の番号を保持する
			now_img_num --;
			if (now_img_num < 0) {
				now_img_num = max_img_num;
			}
			// ●の色を変更
			$(".img_link").css("color", link_color_default);
			$(".link_kind_" + now_img_num).css("color", link_color_click);

			
			$("#carouselInner").animate({
				marginLeft : parseInt($("#carouselInner").css("margin-left"))+panelSize+"px"
			},"slow","swing" , 
			function(){
				$("#carouselInner").css("margin-left","-" + panelSize + "px")
				$("#carouselInner ul.column:last").prependTo("#carouselInner");
				$("#carouselNext,#carouselPrev").show();
			})
		})
		//進むボタン
		$("#carouselNext").click(function(){
			// 戻る、進むボタンを一時的に非表示にして押せなくする
			$("#carouselNext,#carouselPrev").hide();
			
			// 現在表示されている画像の番号を保持する
			now_img_num ++;
			if (now_img_num > max_img_num) {
				now_img_num = 0
			}
			// ●の色を変更
			$(".img_link").css("color", link_color_default);
			$(".link_kind_" + now_img_num).css("color", link_color_click);
			
			
			$("#carouselInner").animate({
			marginLeft : parseInt($("#carouselInner").css("margin-left"))-panelSize+"px"
			},"slow","swing" , 
			function(){


				$("#carouselInner").css("margin-left","-" + panelSize + "px")
				$("#carouselInner ul.column:first").appendTo("#carouselInner");
				$("#carouselNext,#carouselPrev").show();
			})
		})
	}
})(jQuery)
