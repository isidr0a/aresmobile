// JavaScript Document

var aresMobile	={
	/***********************
	*
		FUNCION DE BUSQUEDA
	*
	****************************/
	searchMusic:function (e){
			e.preventDefault();
			e.stopPropagation();
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
					$('#SearchMusicDownResult').empty();
					$('.songs li',html).each(function(index, element) {
                        var song=$(aresMobile.templates.listDown);
						$('a',song).data('url',$('a',element).attr('href')).html($(element).text().replace('[ Descargar ]','')).bind('click',function (){
							$('#SearchMusicDownActions a').data('resources',$(this).data('url'));
						});
						song.appendTo('#SearchMusicDownResult');
                    });
					$('#SearchMusicDownResult').listview('refresh');
				}
			});
	},
	actionSearch:{
		play:function (){
			
		},
		down:function (){
			
		}
	},
	
	/***********************
	*
		REPRODUCTOR APP
	*
	****************************/
	
	/***********************
	*
		INICIALIZANDO APP
	*
	****************************/
	initApp:function (){
		//inizializando buscador
		$('#SearchMusicDown').bind('submit',aresMobile.searchMusic);
	},
	templates:{
		listDown:'<li><a href="#SearchMusicDownActions"></a></li>'
	}
}