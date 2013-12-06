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
		$('#Search-Input-Music').bind('keypress',function (e){
			alert(e.altKey);
		})
	}
}