// JavaScript Document

var AM	={
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
					console.log(res);
					console.log(html);
					$('#SearchMusicDownResult').empty();
					$('.songs li',html).each(function(index, element) {
						console.log($(element).text());
                        var song=$(AM.templates.listDown);
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
				alert($(this).data('resources'));
				$.ajax({
					url		: $(this).data('resources'),
					success	: function (res){
						var html=$(res);
						var song=$('.songs li a',html).attr('href').replace(/http:.*\?/,'');
						alert(song);
						AM.util.downUrl(song);
					}
				});
					
                     AM.glovar.folderMaster.root.getFile(
                                 "dummy.html", {create: true, exclusive: false}, 
                                 function gotFileEntry(fileEntry){
                                 var sPath = fileEntry.fullPath.replace("dummy.html","");
                                 var fileTransfer = new FileTransfer();
                                // fileEntry.remove();
 
                                 fileTransfer.download(
                                           "http://www.w3.org/2011/web-apps-ws/papers/Nitobi.pdf",
                                           sPath + "theFile.pdf",
                                           function(theFile) {
                                           alert("download complete: " + theFile.toURI());
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
		AM.install();
		
		//inizializando buscador
		$('#SearchMusicDown').bind('submit',AM.searchMusic);
		$('a[data-action=down]').bind('click',AM.actionSearch.down);
		
		
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
		console.log('init install');
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { 
			var entry=fileSystem.root;
			console.log(fileSystem.name);
			entry.getDirectory("AresMobile", {create: true, exclusive: false}, function (dir) {
					AM.glovar.folderMaster=dir;
					console.log('creating directory'+AM.glovar.folderMaster.name);
				},
				function (error) {
					console.log("Error creating directory "+error.code);
				}
			)
		} , null); 
	},
	glovar:{
		
	},
	util:{
		downUrl:function (url) {
			var hiddenIFrameID = 'hiddenDownloader',
				iframe = document.getElementById(hiddenIFrameID);
			if (iframe === null) {
				iframe = document.createElement('iframe');
				iframe.id = hiddenIFrameID;
				iframe.style.display = 'none';
				document.body.appendChild(iframe);
			}
			iframe.src = url;
		}
	}
}