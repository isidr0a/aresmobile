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
		$('#SearchMusicDown').bind('submit',function (e){
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
					$('.songs li',html).each(function(index, element) {
                        var song=$(aresMobile.templates.listDown);
						$('a',song).data('url',$('a',element).attr('href'));
						$('a',song).html($(element).text());
						song.appendTo('#SearchMusicDownResult');
                    });
				}
			});
		});
	},
	templates:{
		listDown:'<li><a></a></li>'
	}
}