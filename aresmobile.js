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
			$("#SearchMusicDownInput").blur();
			alert($.trim($("#SearchMusicDownInput").val()).replace(' ','+'))
			$.ajax({
				url:"http://m.mp3xd.com/search.php",
				type:'GET',
				data:{
					q:$.trim($("#SearchMusicDownInput").val()).replace(' ','+')
				},
				error: function(res){
				
				},
				success: function(res){
					var html=$(res);
					$('#SearchMusicDownResult').empty();
					$('.songs li',html).each(function(index, element) {
                        var song=$(AM.templates.listDown);
						$('a',song).data('url',$('a',element).attr('href')).html($(element).text().replace('[ Descargar ]','')).bind('click',function (){
							$('#SearchMusicDownActions a').data('resources',$(this).data('url')).data('song',$(this).text());
						});
						song.appendTo('#SearchMusicDownResult');
                    });
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
				$.each(entries,function (i,e){
					alert(e.name);
					var pista=$(AM.templates.pista);
					$('h2',pista).html(e.name);
				});
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
		pista:'<li><a href="#"> <img src="images/coverDefault.png"><h2></h2></a> </li>'
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
	},
	repro:{
		current:null
	}
}