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
			alert($("#SearchMusicDownInput").val().replace(' ','+'));
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
			  window.requestFileSystem(
                     LocalFileSystem.PERSISTENT, 0, 
                     function onFileSystemSuccess(fileSystem) {
                     fileSystem.root.getFile(
                                 "dummy.html", {create: true, exclusive: false}, 
                                 function gotFileEntry(fileEntry){
                                 var sPath = fileEntry.fullPath.replace("dummy.html","");
                                 var fileTransfer = new FileTransfer();
                                 fileEntry.remove();
 
                                 fileTransfer.download(
                                           "http://www.w3.org/2011/web-apps-ws/papers/Nitobi.pdf",
                                           sPath + "theFile.pdf",
                                           function(theFile) {
                                           console.log("download complete: " + theFile.toURI());
                                           downSuccess(theFile.toURI());
                                           },
                                           function(error) {
                                           console.log("download error source " + error.source);
                                           console.log("download error target " + error.target);
                                           console.log("upload error code: " + error.code);
                                           }
                                           );
                                 }, 
                                 downFail);
                     }, 
                     downFail);
		},
		downSuccess:function (){
			
		},
		downFail:function (){
			
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
	/***********************
	*
		templates
	*
	*************************/
	templates:{
		listDown:'<li><a href="#SearchMusicDownActions"></a></li>'
	},
	/***********************
	*
		install app
	*
	*************************/
	install:function (){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { 
			var entry=fileSystem.root; 
			entry.getDirectory("aresMobile", {create: true, exclusive: false}, function (dir) {
					aresMobile.glovar.folderMaster=dir;
				},
				function (error) {
					console.log("Error creating directory "+error.code)
				}
			)
		} , null); 
	},
	glovar:{
		
	}
}