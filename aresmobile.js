// JavaScript Document

var aresMobile	={
	/***********************
	*
		FUNCION DE BUSQUEDA
	*
	****************************/
	searchMusic:function (){
		
	},
	
	/***********************
	*
		INICIALIZANDO APP
	*
	****************************/
	initApp:function (){
		$('#SearchMusicDown').bind('submit',function (){
			$.ajax({
				url:"http://m.mp3xd.com/search.php",
				type:'GET',
				data:{
					q:$("#SearchMusicDownInput").val().replace(' ','+')
				},
				error: function(res){
				
				},
				success: function(res){
					var html=$(res);
					var songs=$('.songs',html);
					songs.appendTo('#SearchMusicDownResult');
				}
			});
		});
	}
}