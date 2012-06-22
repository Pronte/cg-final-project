var coloreIntonaco = [1.5,1.5,1.5]; 
var colorePavimenti = [244/250, 164/250, 96/250];
var coloreBordini = [245/250,245/250,245/250];
var coloreBordiniScuri = [225/250,225/250,225/250];




var muriTorreFronteA = 	SIMPLEX_GRID([[-0.3,2.4,-1.7,2.4],[-0.3,0.1],[-2,-0.2,-0.3,9.7]]);
var muriTorreFronteB = 	SIMPLEX_GRID([[-0.3,-2.4,1.7    ],[-0.3,0.1],[-2,-0.2,-0.3,0.7,-2.7,3.5,-2.7,0.1]]);

var muriTorreSxA = 		SIMPLEX_GRID([[-0.3,0.1			],[-0.3,-0.1,2.3,-1.7,2.4],[-2,-0.2,-0.3,9.7]]);
var muriTorreSxB = 		SIMPLEX_GRID([[-0.3,0.1			],[-0.3,-2.4,1.7],[-2,-0.2,-0.3,0.7,-2.7,3.5,-2.7,0.1]]);

var muroTorreDx =		SIMPLEX_GRID([[-0.3,-6.4,0.1	],[-0.3,6.5],[-2,-0.2,-0.3,9.7]]);
var muroTorreRetro =	SIMPLEX_GRID([[-0.3,6.4			],[-0.3,-6.4,0.1],[-2,-0.2,-0.3,9.7]]);

//--------------
var muriTorre = STRUCT([muriTorreFronteA,muriTorreFronteB,muriTorreSxA,muriTorreSxB,muroTorreDx,muroTorreRetro]);
muriTorre.color(coloreIntonaco);
//--------------

var pavimentoTorreTerra = SIMPLEX_GRID([[-0.3,6.5],[-0.3,6.5],[-2,-0.2, 0.3]]);
var pavimentoTorrePrimo = SIMPLEX_GRID([[-0.3,-0.1,6.3],[-0.3,-0.1,6.3],[-2,-0.2,-0.3,-5,0.1]]);
var soffittoTorre = 	  SIMPLEX_GRID([[-0.3,6.5],[-0.3,6.5],[-2,-0.2,-0.3,-9.7,0.1]]);

//--------------
var pavimentoTorre = STRUCT([pavimentoTorrePrimo,pavimentoTorreTerra,soffittoTorre]);
pavimentoTorre.color(colorePavimenti);
//--------------

var bordinoSoffittoFronte = 	 SIMPLEX_GRID([[-0.2,6.7],[-0.2,0.1,-6.5,0.1],[-2,-0.2,-0.3,-9.7,0.3]]);
var bordinoSoffittoLato = 	 	 SIMPLEX_GRID([[-0.2,0.1,-6.5,0.1],[-0.3,6.5],[-2,-0.2,-0.3,-9.7,0.3]]);

var bordinoFinestraSottoFronte = SIMPLEX_GRID([[-0.25,6.6],[-0.25,0.05],[-2,-0.5,-0.5,0.2]]);
var bordinoFinestraSottoSx = 	 SIMPLEX_GRID([[-0.25,0.05],[-0.3,6.5],[-2,-0.5,-0.5,0.2]]);

var bordinoBaseTorreFronte = 	 SIMPLEX_GRID([[-0.2,6.7],[-0.2,0.1],[-2,-0.2,0.3]]);
var bordinoBaseTorreSx = 	 	 SIMPLEX_GRID([[-0.2,0.1],[-0.3,6.5],[-2,-0.2,0.3]]);

var bordinoBaseTorreEsternoFronte = SIMPLEX_GRID([[6.8],[0.3],[-2,0.2]]);
var bordinoBaseTorreEsternoSx =  	SIMPLEX_GRID([[0.3],[-0.3,6.5],[-2,0.2]]);

//--------------
var bordini = STRUCT([bordinoFinestraSottoSx,bordinoFinestraSottoFronte,bordinoBaseTorreSx,bordinoBaseTorreFronte,bordinoSoffittoFronte,bordinoSoffittoLato,
						bordinoBaseTorreEsternoFronte,bordinoBaseTorreEsternoSx]);
bordini.color(coloreBordini);
//--------------

var btFronte =  SIMPLEX_GRID([[-0.1,0.2,2.6,-1.3,2.6],[-0.1,0.1],[2]]);
var btSx = 		SIMPLEX_GRID([[-0.1,0.1],[-0.1,-0.1,0.1,2.6,-1.3,2.6],[2]]);

//--------------
var baseTorre = STRUCT([btFronte,btSx]);
baseTorre.color(coloreIntonaco);
//--------------

//--------------
var torre = STRUCT([muriTorre,pavimentoTorre,bordini,baseTorre]);
//--------------

var torre2 = torre.clone();
torre2.scale([0],[-1]);
torre2.translate([0],[30]);


var mkFinestraAltaPiccola = function(){

	var corniceInternaOrizz = SIMPLEX_GRID([[-2.5,1.5,-2.5],[-0.2,0.1],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,0.2,-1,0.2]]);
	var corniceInternaVert = SIMPLEX_GRID([[-2.4,-0.1,0.1,-1.3,0.1,-0.1,-2.4],[-0.2,0.1],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,-0.2,1]]);

//	var corniceEsternaOrizz = SIMPLEX_GRID([[-2.4,0.3,-1.1,0.3,-2.4],[-0.2,0.1],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,-0.2,-1,-0.1,0.1]]);
	var corniceEsternaVert = SIMPLEX_GRID([[-2.4,0.1,-0.1,-1.3,-0.1,0.1,-2.4],[-0.2,0.1],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,0.3,-0.8,0.3]]);

	//spessore raffinamento
	var sr = 0.03
	//profondità raffinamento
	var pr = 0.02

	var raffCorniceEsternaOrizz = SIMPLEX_GRID([[-2.4,1.7,-2.4],[-(0.2-pr),pr],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,sr,-(0.2-sr),-1,-(0.2-sr),sr]]);
	var raffCorniceInternaOrizz = SIMPLEX_GRID([[-2.4,0.1+sr,-(0.1-sr),-1.3,-(0.1-sr),0.1+sr,-2.4],[-(0.2-pr),pr],[-2,-0.2,-0.3,-0.7,-2.7,-(3.5-sr),sr,-0.8,sr]]);

	var raffCorniceInternaVert = SIMPLEX_GRID([[-2.4,-0.1,sr,-(0.1-sr),-1.3,-(0.1-sr),sr,-0.1,-2.4],[-(0.2-pr),pr],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,-0.2,-0.1,0.8]]);
	var raffCorniceEsternaVert = SIMPLEX_GRID([[-2.4,sr,-(0.1-sr),-0.1,-1.3,-0.1,-(0.1-sr),sr,-2.4],[-(0.2-pr),pr],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,-sr,(0.2-sr),(0.1-sr),-sr,-0.8,-sr,(0.2-sr),(0.1-sr)]]);
	
	var raffInternoOrizz = SIMPLEX_GRID([[-(2.6-sr),sr,1.3,sr,-(2.6-sr)],[-(0.2-pr),pr],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,-(0.2-sr),sr,-1,sr]]);
	var raffInternoVert = SIMPLEX_GRID([[-(2.6-sr),sr,-1.3,sr],[-(0.2-pr),pr],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,-0.2,1]]);
	
	

	var cornice = STRUCT([corniceEsternaVert,corniceInternaVert,corniceInternaOrizz]);
	cornice.color(coloreBordini);
	
	var raffinamentoCornice = STRUCT([raffCorniceInternaOrizz,raffCorniceEsternaOrizz,raffCorniceEsternaVert,raffCorniceInternaVert,raffInternoVert,raffInternoOrizz]);
	raffinamentoCornice.color(coloreBordiniScuri);

	var davanzale =  SIMPLEX_GRID([[-2.5,1.5,-2.5],[-0.3,0.2],[-2,-0.2,-0.3,-0.7,-2.7,-3.2,-0.1,0.1,]]);
	davanzale.color(colorePavimenti);

	var finestra = STRUCT([cornice,davanzale,raffinamentoCornice]);

	return finestra;

}


var mkElementoFacciata = function(){

	var muriFacciataFronteA = 	SIMPLEX_GRID([[2.5,-1.5,2.5],[-0.3,0.1],[-2,-0.2,-0.3,0.7,2.7,3.4,1,0.2,0.2]]);
	var muriFacciataFronteB = 	SIMPLEX_GRID([[-2.5,1.5    ],[-0.3,0.1],[-2,-0.2,-0.3,0.7,-2.7,3.3,-1.1,-0.1,0.1,0.2]]);

	var bordinoFinestraSottoFronte = SIMPLEX_GRID([[6.5],[-0.25,0.05],[-2,-0.5,-0.5,0.2]]);
	var bordinoBaseTorreFronte = 	 SIMPLEX_GRID([[6.5],[-0.2,0.1],[-2,-0.2,0.3]]);

	var bordinoSoffittoFronte = 	 SIMPLEX_GRID([[6.5],[-0.2,0.1],[-2,-0.2,-0.3,-8.2,0.3]]);

	var bordinoBaseFacciataEsternoFronte = SIMPLEX_GRID([[6.5],[0.3],[-2,0.2]]);

	var baseFacciataFronte =  SIMPLEX_GRID([[2.6,-1.3,2.6],[-0.1,0.1],[2]]);

	var pavimentoBase =  SIMPLEX_GRID([[6.5],[-0.3,6.5],[-2,-0.2, 0.3]]);
	var pavimentoPrimo = SIMPLEX_GRID([[6.5],[-0.3,-0.1,6.4],[-2,-0.2,-0.3,-5,0.1]]);
	var soffitto = 		 SIMPLEX_GRID([[6.5],[-0.3,6.5],[-2,-0.2,-0.3,-8.2,0.1]]);

	var pavimenti = STRUCT([pavimentoBase,pavimentoPrimo,soffitto]);
	pavimenti.color(colorePavimenti);

	var intonaco = STRUCT([muriFacciataFronteB,muriFacciataFronteA,baseFacciataFronte]);
	intonaco.color(coloreIntonaco);

	var finestraAlta = mkFinestraAltaPiccola();

	var bordi = STRUCT([bordinoFinestraSottoFronte,bordinoBaseTorreFronte,bordinoSoffittoFronte,bordinoBaseFacciataEsternoFronte]);
	bordi.color(coloreBordini);

	var elem = STRUCT([intonaco,bordi,finestraAlta,pavimenti]);

	return elem;
}

var elFac = mkElementoFacciata();
var traslFac = T([0])([6.5]);

var facciata = STRUCT([elFac,traslFac,elFac,traslFac,elFac]);

var intermezzoTorreFacciata = 1;

facciata.rotate([0,1],[-PI/2]);
facciata.translate([1],[6.5*3+6.5+intermezzoTorreFacciata]);

var facciata2 = S([0])([-1])(facciata);
facciata2.translate([0],[30]);


var villa = STRUCT([torre,facciata,torre2,facciata2]);

DRAW(villa);