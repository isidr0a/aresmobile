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
			$.mobile.loading( "show");
			alert($.trim($("#SearchMusicDownInput").val()).replace(' ','+'));
			$("#SearchMusicDownInput").blur();
			$.ajax({
				url:"http://m.mp3xd.com/search.php",
				type:'GET',
				data:{
					q:$.trim($("#SearchMusicDownInput").val()).replace(' ','+')
				},
				error: function(res){
					alert('error');
					$.mobile.loading( "hide");
				},
				success: function(res){
					alert('busqueda terminada');
					var html=$(res);
					$.mobile.loading( "hide");
					$('#SearchMusicDownResult').empty();
					var canciones=$('.songs li',html);
					if(canciones.length>0){
						$('.songs li',html).each(function(index, element) {
							var song=$(AM.templates.listDown);
							$('a',song).data('url',$('a',element).attr('href')).html($(element).text().replace('[ Descargar ]','')).bind('click',function (){
								$('#SearchMusicDownActions a').data('resources',$(this).data('url')).data('song',$(this).text());
							});
							song.appendTo('#SearchMusicDownResult');
						});
					}
					else{
						alert('Disculpe, no hay resultados');
					}
					$('#SearchMusicDownResult').listview('refresh');
				}
			});
	},
	actionSearch:{
		play:function (){
			$( "#SearchMusicDownActions" ).panel( "close" );
			var song=$(this).data('song')
			$.ajax({
				url		: $(this).data('resources'),
				success	: function (res){
					var html=$(res);
					var uriSong=$('.songs li a',html).attr('href').replace(/http:.*\?/,'');
					if(AM.repro.current){
						AM.repro.current.pause();
						AM.repro.current=null;
					}
					AM.repro.current=new Media(uriSong,
						function () { console.log("playAudio():Audio Success"); },
						function (err) { console.log("playAudio():Audio Error: " + err); }
					)
					AM.repro.current.play();
					}
				});
			
		},
		down:function (){
				$( "#SearchMusicDownActions" ).panel( "close" );
				var song=$(this).data('song')
				$.ajax({
					url		: $(this).data('resources'),
					success	: function (res){
						var html=$(res);
						var uriSong=$('.songs li a',html).attr('href').replace(/http:.*\?/,'');
						var fileTransfer = new FileTransfer();
						var idDown='DownId'+Math.floor((Math.random() * 100) + 1);
						var view=$(AM.templates.pista);
						$('h2',view).html(song);
						fileTransfer.onprogress = function(progressEvent) {
							if (progressEvent.lengthComputable) {
								var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
								$('p',view).html(perc + "% loaded...");
							} else {
								if(statusDom.innerHTML == "") {
									$('p',view).html("Loading");
									statusDom.innerHTML = "Loading";
								} else {
									$('p',view).html(".");
								}
							}
						};
						fileTransfer.download(
							uriSong,
							AM.glovar.folderMaster.fullPath + "/"+song+".mp3",
							function(theFile) {
							   	alert("download complete: " + theFile.toURI());
							   	alert("download complete: " + theFile.toURL());
							   	alert("download complete: " + theFile.fullPath);
							   	//AM.actionSearch.downSuccess(theFile.toURI());
							},
							function(error) {
							   alert("download error source " + error.source);
							   alert("download error target " + error.target);
							   alert("upload error code: " + error.code);
							}
						);
					}
				});
				alert(AM.glovar.folderMaster.name);
				alert(AM.glovar.folderMaster.fullPath);
				
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
	biblio:{
		updateAll:function (){
			function success(entries) {
				var i;
				var aux=[];
				$('#pageBiblio [data-role=listview]').empty();
				$.each(entries,function (i,e){
					alert(e.name);
					var pista=$(AM.templates.pista);
					$('h2',pista).html(e.name);
					pista.appendTo('#pageBiblio [data-role=listview]');
				});
				$('#pageBiblio [data-role=listview]').listview( "refresh" );
			}
			
			function fail(error) {
				alert("Failed to list directory contents: " + error.code);
			}
			
			var directoryReader = AM.glovar.folderMaster.createReader();
			
			directoryReader.readEntries(success,fail);
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
		listDown:'<li><a href="#SearchMusicDownActions"></a></li>',
		pista:'<li><a href="#"> <img src="images/coverDefault.png"><h2></h2><p></p></a> </li>'
	},
	/***********************
	*
		install app
	*
	*************************/
	install:function (){
		alert('init install');
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { 
			var entry=fileSystem.root;
			entry.getDirectory("AresMobile", {create: true, exclusive: false}, function (dir) {
					AM.glovar.folderMaster=dir;
					AM.biblio.updateAll()
				},
				function (error) {
				}
			)
		} , null); 
	},
	glovar:{
		
	},
	repro:{
		current:null
	}
}