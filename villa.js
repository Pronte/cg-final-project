//#################colori####################

var coloreIntonaco = [1.5,1.5,1.5]; 
var colorePavimenti = [244/255, 164/255, 96/255];
var coloreBordini = [245/255,245/255,245/255];
var coloreBordiniScuri = [225/255,225/255,225/255];
var coloreColonne = [255/255,235/255,205/255];
var coloreTimpano = coloreBordini;
var coloreFregioSottoTimpano = [235/255,235/255,205/255];
var coloreTetti = [254/255,111/255,94/255];
var colorePuntale = coloreBordini;
var colorePortico = [1,1,1];

//#################utilities#################

var resMapMedRes = {
	"capitello" : [20,20],
	"blocco" : [8,10],
	"retroArco" : [30,3],
	"cunetta" : [10,1],
	"cunettaAlta" : [28,1],
	"cupolaPortico" : [28,28],
	"soffittoPortico" : [1,28]
};
var resMapLowRes = {
	"capitello" : [10,10],
	"blocco" : [3,3],
	"retroArco" : [10,3],
	"cunetta" : [10,1],
	"cunettaAlta" : [18,1],
	"cupolaPortico" : [18,18],
	"soffittoPortico" : [1,18]
};

var resMap = resMapLowRes;

var mkKnotsG2 = function (cpoints){
	var knots = [0,0,0];

	var segNum = cpoints.length -2;

	for(var i =1; i <= segNum; i++){
		knots.push(i);

		if(i == segNum){
			knots.push(i);
			knots.push(i);
		}
	}

	return knots;
}

var mkKnotsG1 = function (cpoints){
	var knots = [0,0];

	var segNum = cpoints.length -1;

	for(var i =1; i <= segNum; i++){
		knots.push(i);

		if(i == segNum){
			knots.push(i);
		}
	}

	return knots;
}

var mkNub = function(cp,grade,sel){
	sel = sel || S0;
	grade = grade || 1;

	if (grade == 1 ){
		return NUBS(sel)(1)(mkKnotsG1(cp))(cp);
	} else {
		return NUBS(sel)(2)(mkKnotsG2(cp))(cp);
	}
}

var mkNubG2 = function(cp,sel){
	sel = sel || S0;
	return NUBS(sel)(2)(mkKnotsG2(cp))(cp);
}
var mkNubG1 = function(cp,sel){
	sel = sel || S0;
	return NUBS(sel)(1)(mkKnotsG1(cp))(cp);
}
var mkBezier = function(cp,sel){
	sel = sel || S0;
	return BEZIER(sel)(cp);
};

var mkNubG1SurfaceWithCPoints = function (cps){
	var handles = cps.map(function(cp){return mkNubG1(cp,S0);});
	return mkNubG1(handles,S1);
}
var mkNubSurfaceWithCPointsAndGrades = function (cps, curvesGrade, surfGrade){
	curvesGrade = curvesGrade || 1;
	surfGrade = surfGrade || 1;

	var handles = cps.map(function(cp){return mkNub(cp,curvesGrade,S0);});
	return mkNub(handles,surfGrade,S1);
}

var D11 = DOMAIN([[0,1],[0,1]]);

var scorrimentoProfilo = function(cp,scorrXY,scorrXZ,manualMinMaxes){ //scorrimento X relaivo a Y, scorrimento X relativo a Z
	var sxy = scorrXY || 0;
	var sxz = scorrXZ || 0;

	var p = cp[0];
	var z;
	var y;

	var zmax = p[2];
	var zmin = p[2];
	var ymax = p[1];
	var ymin = p[1];

	for(var i in cp){
		p = cp[i];
		z = p[2];
		y = p[1];
		z>zmax ? zmax = z : zmax = zmax ;
		z<zmin ? zmin = z : zmin = zmin ;
		y>ymax ? ymax = y : ymax = ymax ;
		y<ymin ? ymin = y : ymin = ymin ;
	}

	if (manualMinMaxes == undefined){
		manualMinMaxes = [undefined,undefined,undefined,undefined];
	}
	var manualYMin = manualMinMaxes[0];
	var manualYMax = manualMinMaxes[1];
	var manualZMin = manualMinMaxes[2];
	var manualZMax = manualMinMaxes[3];

	ymin = manualYMin || ymin;
	ymax = manualYMax || ymax;
	zmin = manualZMin || zmin;
	zmax = manualZMax || zmax;

	return cp.map(function(p){return [p[0]+(sxy*((p[1]-ymin)/ymax))+(sxz*((p[2]-zmin)/zmax)),p[1],p[2]];});
}

var doubleCP = function(arr){

	var ret = [arr[0]];

	for(var i = 1; i<arr.length-1; i++){
		ret.push(arr[i]);
		ret.push(arr[i]);
	}
	ret.push(arr[arr.length-1]);

	return ret;
}

var puntoMedio = function(points){
	var x = 0;
	var y = 0;
	var z = 0;
	var l = points.length;

	for(var i = 0; i<l; i++){
		x += points[i][0];
		y += points[i][2];
		z += points[i][2];
	}

	return [x/l,y/l,z/l];
}

	//prende in input un array composto da punti in formato [x,y,z], restituisce un array con i punti traslati dei valori in input
var traslaPunti = function (arr,x,y,z){
	x = x || 0;
	y = y || 0;
	z = z || 0;

	return arr.map(function(p){return [p[0]+x,p[1]+y,p[2]+z];});
}

	//prende in input un array composto da punti in formato [x,y,z], restituisce un array con i punti scalati dei valori in input
var scalaPunti = function (arr,x,y,z){
	x = x || 1;
	y = y || 1;
	z = z || 1;

	return arr.map(function(p){return [p[0]*x,p[1]*y,p[2]*z];});
}

var ribaltaXPunti = function(arr){
	return arr.map(function(p){return [-p[0],p[1],p[2]];});
}

var ribaltaYPunti = function(arr){
	return arr.map(function(p){return [p[0],-p[1],p[2]];});
}

	//crea il bordo inclinato per combinazione lineare (simula una proiezione), dopo cp2
	//es:     |	   				<-cp1
	//	 cp2-> 				|/   <- result
var proiezioneConCombinazioneLineare = function (cp1,cp2,delta,manualMinMaxes){
	if(cp1.length != cp2.length){
		throw "arrays' length differs, cannot combine";
	}
	
	var p = cp2[0];
	var z;
	var y;
	
	if (manualMinMaxes == undefined){		
		var zmax = p[2];
		var zmin = p[2];
		var ymax = p[1];
		var ymin = p[1];


		for(var i in cp2){
			p = cp2[i];
			z = p[2];
			y = p[1];
			z>zmax ? zmax = z : zmax = zmax ;
			z<zmin ? zmin = z : zmin = zmin ;
			y>ymax ? ymax = y : ymax = ymax ;
			y<ymin ? ymin = y : ymin = ymin ;
		}
	} else {
			var ymin = manualMinMaxes[0];
			var ymax = manualMinMaxes[1];
			var zmin = manualMinMaxes[2];
			var zmax = manualMinMaxes[3];
	}
	
	// calcolo la distanza tra i due estremi
	var dx = cp2[0][0] - cp1[0][0];
	var dz = cp2[0][2] - cp1[0][2];
	var dist = Math.sqrt((dz*dz) + (dx*dx));
	
	//il massimo valore di lambda per ottenere il punto distante "delta" da cp2
	var maxLambdaOver1 = (delta/dist);

	var lambdaMin = 1;
	var lambda;
	var pret;
	var ret = [];

	var p1;
	var p2;
	for(var i = 0; i<cp1.length; i++){
		p1 = cp1[i];
		p2 = cp2[i];

		lambda = ((p2[2]-zmin)/(zmax-zmin)) * maxLambdaOver1;
		lambda += lambdaMin;

		pret = [	((p2[0]*lambda) + (p1[0]*(1-lambda)) ),
					 p2[1],//(p2[1]*lambda + p1[1]*(1-lambda) ),
					((p2[2]*lambda) + (p1[2]*(1-lambda)) )];

		ret.push(pret);
	}

	return ret;
}

//######################################### ELEMENTS

var mkPuntale = function(){
			var cuboPunta = T([0,1])([-0.25,-0.25])(CUBOID([0.5,0.5,0.5]));
			var cuboPunta2 = T([0,1])([-0.2,-0.2])(CUBOID([0.4,0.4,0.6]));

			var profiloPuntale = [[0.05,0,0.6],[0.2,0,0.65],[0.2,0,0.8],[0.05,0,1],[0.05,0,1.2],[0.05,0,1.2],[0,0,1.2]];
			var basePuntale = [[1,1,0],[1,-1,0],[-1,-1,0],[-1,1,0],[1,1,0]];

			var puntaleSurf = PROFILEPROD_SURFACE([mkNubG2(profiloPuntale,S0),mkNubG1(basePuntale,S1)]);

			var puntaleCurvo = MAP(puntaleSurf)(DOMAIN([[0,1],[0,1]])([15,4]));

			var antenna = POLYLINE([[0,0,0],[0,0,3]]);
				antenna.color([0,0,0]);

			var puntale = STRUCT([cuboPunta,cuboPunta2,puntaleCurvo]);
				puntale.color(colorePuntale);
				
			return STRUCT([puntale,antenna]);
}

var mkTorre = function (){
		var muriTorreFronteA = 	SIMPLEX_GRID([[-0.3,2.4,-1.7,2.4],[-0.3,0.1],[-2,-0.2,0.3,9.7]]);
		var muriTorreFronteB = 	SIMPLEX_GRID([[-0.3,-2.4,1.7    ],[-0.3,0.1],[-2,-0.2,0.3,0.7,-2.7,3.5,-2.7,0.1]]);

		var muriTorreSxA = 		SIMPLEX_GRID([[-0.3,0.1			],[-0.3,-0.1,2.3,-1.7,2.4],[-2,-0.2,0.3,9.7]]);
		var muriTorreSxB = 		SIMPLEX_GRID([[-0.3,0.1			],[-0.3,-2.4,1.7],[-2,-0.2,0.3,0.7,-2.7,3.5,-2.7,0.1]]);

		var muroTorreDxA =		SIMPLEX_GRID([[-0.3,-6.4,0.1	],[-0.3,(6.5-1.3)/2,-1.3,(6.5-1.3)/2],[-2,-0.2,0.3,9.7]]);
		var muroTorreDxB =		SIMPLEX_GRID([[-0.3,-6.4,0.1	],[-0.3,-(6.5-1.3)/2,1.3,-(6.5-1.3)/2],[-2,-0.2,-2.5,7.5]]);
		var muroTorreRetro =	SIMPLEX_GRID([[-0.3,6.4			],[-0.3,-6.4,0.1],[-2,-0.2,0.3,9.7]]);

		//--------------
		var muriTorre = STRUCT([muriTorreFronteA,muriTorreFronteB,muriTorreSxA,muriTorreSxB,muroTorreDxA,muroTorreDxB,muroTorreRetro]);
		muriTorre.color(coloreIntonaco);
		//--------------

		var pavimentoTorreTerra = SIMPLEX_GRID([[-0.3,6.5],[-0.3,6.5],[-2,-0.1,0.1]]);
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

		var xtorre = 6.5;
		var ytorre = 6.5;

		var profiloBordinoAlto = [[0,0,0],[0,0.07,0],[0,0.09,0.025],[0,0.09,0.065],[0,0.125,0.075],[0,0.125,0.1],[0,0,0.1]];
		var pbaObliquo1 = profiloBordinoAlto.map(function(p){return [p[1]+xtorre/2+0.1,p[1]+ytorre/2+0.1,p[2]]});

		var pbaObliquo2 = ribaltaXPunti(pbaObliquo1);
		var pbaObliquo3 = ribaltaYPunti(pbaObliquo1);
		var pbaObliquo4 = ribaltaYPunti(pbaObliquo2);

		var pbaCP = [pbaObliquo1,pbaObliquo2,pbaObliquo4,pbaObliquo3,pbaObliquo1];


		var bordinoAltoNub = mkNubSurfaceWithCPointsAndGrades(pbaCP,1,1);
		var bordinoAlto = MAP(bordinoAltoNub)(DOMAIN([[0,1],[0,1]])([pbaObliquo1.length-1,4]));
			bordinoAlto.translate([0,1,2],[xtorre/2 + 0.3,ytorre/2 + 0.3,2.2+10+0.3]);

		//--------------
		var bordini = STRUCT([bordinoFinestraSottoSx,bordinoFinestraSottoFronte,bordinoBaseTorreSx,bordinoBaseTorreFronte,bordinoSoffittoFronte,bordinoSoffittoLato,
								bordinoBaseTorreEsternoFronte,bordinoBaseTorreEsternoSx,bordinoAlto]);
		bordini.color(coloreBordini);
		//--------------

		var btFronte =  SIMPLEX_GRID([[-0.1,0.2,2.6,-1.3,2.6],[-0.1,0.1],[2]]);
		var btSx = 		SIMPLEX_GRID([[-0.1,0.1],[-0.1,-0.1,0.1,2.6,-1.3,2.6],[2]]);

		//--------------
		var baseTorre = STRUCT([btFronte,btSx]);
		baseTorre.color(coloreIntonaco);
		//--------------

		var mkTettoTorre = function(){
			var xtetto = 7.1;
			var ytetto = 7.1;
			var htetto = 1.7;
			var puntaTetto = [xtetto/2,ytetto/2,htetto];

			var ftetto = function(p){
				var z = p[2];

				if (z>0){ return puntaTetto;}
				else {return p;}
				
			};

			var tetto = CUBOID([xtetto,ytetto,htetto]);
				tetto = MAP(ftetto)(tetto);
				tetto.color(coloreTetti);

			var puntale = mkPuntale();
				puntale.translate([0,1,2],[xtetto/2,ytetto/2,1.55]);
			return STRUCT([tetto,puntale]);
		}


		var tettoTorre = mkTettoTorre();
			tettoTorre.translate([0,1,2],[0,0,2.2+10+0.3+0.1]);

		var torre = STRUCT([muriTorre,pavimentoTorre,bordini,baseTorre,tettoTorre]);

		return torre;
}



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

	var muriFacciataFronteA = 	SIMPLEX_GRID([[2.5,-1.5,0.2],[-0.3,0.1],[-2,-0.2,-0.3,0.7,2.7,3.4,1,0.2,0.2]]);
	var muriFacciataFronteB = 	SIMPLEX_GRID([[-2.5,1.5    ],[-0.3,0.1],[-2,-0.2,-0.3,0.7,-2.7,3.3,-1.1,-0.1,0.1,0.2]]);

	var bordinoFinestraSottoFronte = SIMPLEX_GRID([[4.2],[-0.25,0.05],[-2,-0.5,-0.5,0.2]]);
	var bordinoBaseTorreFronte = 	 SIMPLEX_GRID([[4.2],[-0.2,0.1],[-2,-0.2,0.3]]);

	var bordinoSoffittoFronte = 	 SIMPLEX_GRID([[4.2],[-0.2,0.1],[-2,-0.2,-0.3,-8.2,0.3]]);

	var bordinoBaseFacciataEsternoFronte = SIMPLEX_GRID([[4.2],[0.3],[-2,0.2]]);

	var baseFacciataFronte =  SIMPLEX_GRID([[2.6,-1.3,0.3],[-0.1,0.1],[2]]);

	var pavimentoBase =  SIMPLEX_GRID([[4.2],[-0.3,6.5],[-2,-0.2, 0.3]]);
	var pavimentoPrimo = SIMPLEX_GRID([[4.2],[-0.3,-0.1,6.4],[-2,-0.2,-0.3,-5,0.1]]);
	var soffitto = 		 SIMPLEX_GRID([[4.2],[-0.3,6.5],[-2,-0.2,-0.3,-8.2,0.1]]);

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

var mkCustomBlocco = function (cpoints,spessore,n,durezzaCurva,grado){ //control points sul piano X,Z ! (y = 0 per ogni punto) , 0 = usa valore di default.
	if(cpoints == undefined){
		console.log("NO CONTROL POINTS FOR THIS BLOCK!")
		return undefined;
	}

	var spess = spessore || 0.2;
	var nn = n || resMap["blocco"][0];
	var durezza = durezzaCurva || 2;
	var g = grado || 2;

	var detail = resMap["blocco"][1];

	var domain2 = DOMAIN([[0,1],[0,1]])([nn,detail]);

	var base = mkNub(cpoints,g,S0);


	var csopra = cpoints.map(function(p){return [p[0],spess,p[2]]});
	var sopra = mkNub(csopra,g,S0);



	var xEnd = 0;
	var yEnd = spess;
	var zEnd = 0;

	for (var i in cpoints){
		xEnd += cpoints[i][0];
		zEnd += cpoints[i][2];
	}

	xEnd = xEnd/cpoints.length;
	zEnd = zEnd/cpoints.length;

	pEnd = [xEnd,yEnd,zEnd];


	var puntoDiChiusura = function(){return pEnd;}

	var controls = [base];
	for(var i = 0; i<durezza; i++){
		controls.push(sopra);
	}
	controls.push(puntoDiChiusura);

	var surf = BEZIER(S1)(controls);

	var dsurf = MAP(surf)(domain2);

	return dsurf;
}

var mkBlocco = function(n,spess,l,h,alfa){

	var ll = l || 0.8;
	var hh = h || 0.35;
	var nn = n || 10;
	var spessore = spess || 0.3;


	var cbase = [[ll/2,0,hh],[ll*0.3/2,0,hh],[0,0,hh],[0,0,hh/2],[0,0,0],[ll*0.3/2,0,0],[ll*1.7/2,0,0],[ll,0,0],[ll,0,hh/2],[ll,0,hh],[ll*1.7/2,0,hh],[ll/2,0,hh]];

	return mkCustomBlocco(cbase,spessore,nn);

}

var mkCapitello = function(){

	var l = 0.8;
	var h = 0.35;

	lcurv = 0.4;
	hcurv = 0.8;

	var spess = 0.3;

	var cpOrizz = [[0,0,0],[spess*(1-hcurv),0,0],[spess,0,0],[spess,l*(lcurv),0],[spess,l*(1-lcurv),0],[spess,l,0],[spess*(1-hcurv),l,0],[0,l,0]];
	
	var cpVert = [[0,0,0],[1,0,0],[1,0,h*0.05],[1,0,h*0.6],[0.5,0,h*0.7],[0.5,0,h*0.75],[0.7,0,h*0.85],[0.7,0,h*0.93],[0.5,0,h*1],[0,0,h*1]];


	var ctrasl = cpOrizz.map(function(p){return [p[0],(p[1]-l/2),p[2]];});	

	var profiloVert = NUBS(S0)(2)(mkKnotsG2(cpVert))(cpVert);
	var profiloOrizz = NUBS(S1)(2)(mkKnotsG2(ctrasl))(ctrasl);

	var dom2 = DOMAIN([[0,1],[0,1]])(resMap["capitello"]);

	var capitello = MAP(PROFILEPROD_SURFACE([profiloVert,profiloOrizz]))(dom2);
	
	capitello.rotate([0,1],[PI/2]);
	capitello.translate([0],[l/2]);

	return capitello;
};


var mkColonna = function (){
	var hcapitello = 0.35;

	var bCircularDetail = 12;

	var b = mkBlocco(bCircularDetail);

	var capitello = mkCapitello();
	var capitelloAlto = S([2])([-1])(capitello);
	capitelloAlto.translate([2],[14*0.35 + 2*hcapitello]);
	b.translate([2],[hcapitello]);


	var blocks = [b];
	for(var i = 1; i<14; i++){
		b = b.clone().translate([2],[0.35]);
		blocks.push(b);
	}
	var colonna = STRUCT(blocks);

	colonna = STRUCT([colonna,capitello,capitelloAlto]);

	colonna.rotate([0,1],[PI]);
	colonna.translate([0,1],[0.8,0.4]);

	return colonna;
}


var mkArcata = function (){

		var bCircularDetail = 10;

		//var cpb0 = [[-0.2,0,0.01],[0+0.1,0,0.01],[0.3,0,0.01],[0.3,0,0.12],[0.3,0,0.23],[0.3,0,0.34],[0,0,0.34],[-0.2,0,0.34],[-0.2,0,0.01]];

		var cpb1 = doubleCP([[0,0,0],[0.31,0,0],[0.31,0,0.3],[0,0,0.35],[0,0,0]]);
		var cpb2 = doubleCP([[0.31,0,0.3],[0,0,0.35],[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.31,0,0.3]]);
		var cpb3 = doubleCP([[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.5,0,0.8],[0.2,0,1.05],[0,0,1.05],[0,0,0.7]]);
		var cpb4 = doubleCP([[0.5,0,0.8],[0.2,0,1.05],[0,0,1.05],[0,0,1.4],[0.2,0,1.4],[0.6,0,1.4],[0.8,0,1.05],[0.5,0,0.8]]);
		var cpb5 = doubleCP([[0.6,0,1.4],[0.8,0,1.05],[1.1,0,1.2],[0.85,0,1.75],[0.6,0,1.75],[0.6,0,1.4]]);
		var cpb6 = doubleCP([[1.1,0,1.2],[0.85,0,1.75],[1.25,0,1.75],[1.35,0,1.25],[1.1,0,1.2]]);

		var cpb8 = doubleCP([[0,0,1.4],[0.6,0,1.4],[0.6,0,1.75],[0,0,1.75],[0,0,1.4]]);

		var cpChiave = doubleCP([[1.25,0,1.75],[1.35,0,1.2],[1.4,0,1.1],[1.6,0,1.1],[1.65,0,1.2],[1.75,0,1.75],[1.25,0,1.75]]);

		//var cpRetroArcoA = [[0,0,0],[0.3,0,0],[0.3,0,0],[0.3,0,0.3],[0.35,0,0.5],[0.5,0,0.8],[0.8,0,1.05],[1.1,0,1.2],[1.35,0,1.25],[1.4,0,1.25],[1.4,0,1.25],[1.4,0,1.75],[1.4,0,1.75],[0,0,1.75],[0,0,1.75],[0,0,0]];
		var cpRetroArcoA = [[0.3,0,0],[0.3,0,0.3],[0.35,0,0.5],[0.5,0,0.8],[0.8,0,1.05],[1.1,0,1.2],[1.35,0,1.25],[1.4,0,1.25],[1.4,0,1.25],[1.4,0,1.75],[1.4,0,1.75],[0.3,0,1.75],[0.3,0,1.75],[0.3,0,0]];
		var cpRetroArcoB = traslaPunti(cpRetroArcoA,0,0.9,0);
		var pDiChiusuraA = [0.3,0,1.7];
		var pDiChiusuraB = [0.3,0.9,1.7];

		var chiusuraFronte = [pDiChiusuraA,pDiChiusuraA,pDiChiusuraA];
		var chiusuraRetro = [pDiChiusuraB,pDiChiusuraB,pDiChiusuraB];

		var b0 = mkBlocco(bCircularDetail+2,0.2,0.6,0.33);
			b0.translate([0,2],[-0.3,0.01]);
			b0.translate([2],[0.35]);

		var b0s = [b0];

		for(var i = 0; i<8; i++){
			b0 = b0.clone().translate([2],[0.35]);
			b0s.push(b0);
		}

		var colonnina = STRUCT(b0s);
			colonnina.scale([1],[-1]);

		var b1 = mkCustomBlocco(cpb1,0.2,bCircularDetail+2);
		var b2 = mkCustomBlocco(cpb2,0.2,bCircularDetail+4);
		var b3 = mkCustomBlocco(cpb3,0.2,bCircularDetail);
		var b4 = mkCustomBlocco(cpb4,0.2,bCircularDetail+2);
		var b5 = mkCustomBlocco(cpb5,0.2,bCircularDetail+2);
		var b6 = mkCustomBlocco(cpb6,0.2,bCircularDetail);

		var b8 = mkCustomBlocco(cpb8,0.2,bCircularDetail+2);
			
		var arco = STRUCT([b1,b2,b3,b4,b5,b6,b8]);
			arco.translate([2],[0.35 + 0.35*10]);
			arco.scale([1],[-1]);

		var blocchiSquadratiA = SIMPLEX_GRID([[0.4],[0.9+0.2],[0.35,-0.35*9,0.35]]);
		var blocchiSquadratiB = SIMPLEX_GRID([[0.4],[0.1],[0.35,-0.35*9,0.35]]);
			blocchiSquadratiA.translate([1],[-0.2]);
			blocchiSquadratiB.translate([0,1],[-0.4,0.8]);

		var blocchiSquadrati = STRUCT([blocchiSquadratiA,blocchiSquadratiB]);

		var retroArcoMapping = mkNubSurfaceWithCPointsAndGrades([chiusuraFronte,cpRetroArcoA,cpRetroArcoB,chiusuraRetro], 2, 1);
		var domRetroArco = DOMAIN([[0,1],[0,1]])(resMap["retroArco"]);
		var retroArco = MAP(retroArcoMapping)(domRetroArco);
			retroArco.translate([0,1,2],[-0.01,-0.1,0.35*11 + 0.01]);

		var arcataSx = STRUCT([colonnina,arco,blocchiSquadrati,retroArco]);
		var arcataDx = arcataSx.clone().scale([0],[-1]).translate([0],[3]);

		var chiaveDiVolta = mkCustomBlocco(cpChiave,0.25,bCircularDetail,3);
			chiaveDiVolta.translate([2],[0.35 + 0.35*10]);
			chiaveDiVolta.scale([1],[-1]);
		
		var retroChiave = mkCustomBlocco(cpChiave,0.9,bCircularDetail,4);
			retroChiave.translate([2],[0.35 + 0.35*10]);


		var arcata = STRUCT([arcataSx,arcataDx,chiaveDiVolta,retroChiave]);
			arcata.translate([1],[0.2]);
			arcata.color(coloreColonne);

		return arcata;
}


var mkTimpano = function(){
		var dom14x2 = DOMAIN([[0,1],[0,1]])([14,2]);
		var dom14x1 = DOMAIN([[0,1],[0,1]])([14,1]);


		var cpCornicione = [[0,0,0],[0,0.1,0],[0,0.1,0.1],[0,0.2,0.1],[0,0.2,0.2],[0,0.4,0.7],[0,0.5,0.7],[0,0.5,0.8],[0,0.6,0.8],[0,0.6,1],[0,0.7,1],[0,0.7,1.1],[0,0.8,1.1],[0,0.8,1.2],[0,0,1.2]];
			cpCornicione = traslaPunti(scalaPunti(cpCornicione,1,1,0.5),0,0,0.33);

		var cpCornicioneBasso = [[0,0,0],[0,0.55,0],[0,0.55,0.2],[0,0.6,0.2],[0,0.6,0.25],[0,0.75,0.4],[0,0.8,0.4],[0,0.8,0.5],[0,0,0.5]];


		var eccedenzaCornicioneAlto = 0.3;
		var lunghezzaTimpano = 14.6;
		var lunghezzaTimpanoAlto = lunghezzaTimpano + 2*eccedenzaCornicioneAlto;
		var altezzaPunta = 3;

		var scorrimentoTimpano = 0.5;

		var frevX = function(p){ return [-p[0], p[1],p[2]]}


		var cpPunta = traslaPunti(cpCornicione,lunghezzaTimpanoAlto/2,0,altezzaPunta);

		var cpAngoloDX = traslaPunti(cpCornicione,scorrimentoTimpano,0,0);

		var cpAngoloDXPiegato = proiezioneConCombinazioneLineare(cpPunta,cpAngoloDX,scorrimentoTimpano);

		var cpAngoloSXPiegato = traslaPunti(cpAngoloDXPiegato.map(frevX) ,lunghezzaTimpanoAlto,0,0);

		var cornTimpanoCPS = [cpAngoloSXPiegato,cpPunta,cpAngoloDXPiegato];

		var cornTimpano = mkNubG1SurfaceWithCPoints(cornTimpanoCPS);	

		var cornicioneTimpano = MAP (cornTimpano)(dom14x2);

		var pmDX = puntoMedio(cpAngoloDXPiegato);
			pmDX[1] = 0;
		var pmSX = puntoMedio(cpAngoloSXPiegato);
			pmSX[1] = 0;

		var tappoDXmap = mkNubG1SurfaceWithCPoints([cpAngoloDXPiegato,[pmDX,pmDX]]);
		var tappoSXmap = mkNubG1SurfaceWithCPoints([cpAngoloSXPiegato,[pmSX,pmSX]]);

		var tappoDX = MAP(tappoDXmap)(dom14x1);
		var tappoSX = MAP(tappoSXmap)(dom14x1);


		var cpCornicioneBassoDX = traslaPunti(cpCornicioneBasso,eccedenzaCornicioneAlto,0,0);
		var cpCornicioneBassoSX = traslaPunti(cpCornicioneBassoDX,lunghezzaTimpano,0,0);

		var cornicioneBassoMap = mkNubG1SurfaceWithCPoints([cpCornicioneBassoSX,cpCornicioneBassoDX]);
		var cornicioneBasso = MAP(cornicioneBassoMap)(D11([8,1]));

		var pmBassoDX = puntoMedio(cpCornicioneBassoDX);
			pmBassoDX[1] = 0;

		var tappoBassoDXMap = mkNubG1SurfaceWithCPoints([cpCornicioneBassoDX,[pmBassoDX,pmBassoDX]]);
		
		var tappoBassoDX = MAP(tappoBassoDXMap)(dom14x1);
		var tappoBassoSX = T([0])([lunghezzaTimpano])(tappoBassoDX);
		
		var timpano = STRUCT([cornicioneTimpano,tappoSX,tappoDX,cornicioneBasso,tappoBassoDX,tappoBassoSX]);
		timpano.rotate([0,1],[PI]);
		timpano.translate([0],[lunghezzaTimpano + eccedenzaCornicioneAlto]);

		return timpano;
	}

var mkFregioSottoTimpano = function(){

	var h = 1;

	var dimSlotX = 7/9;
	var dimFregioX = 3/9;

	var miniColonnaX = 1/9;
	var faccMiniColonnaX = 1/27;

	var z3 = (4-0.8)/15;
	var z2 = (4-1.2)/15;
	var z1 = (4-1.6)/15;

	var z6 = 12/15;
	var z5 = (12-0.8)/15;
	var z4 = 4/15;
	var z45 = (12-1.4)/15;


	var y1 = 0.25;
	var y2 = 0.1;
	var y3 = 0.2;

	var pezzettino = CUBOID([miniColonnaX/3,y1,z2-z1]);
		pezzettino.translate([0,2],[miniColonnaX/9,z1-(0.2/15)]);

	var pezzettino2 = T([0])([miniColonnaX/3 + miniColonnaX/9])(pezzettino);

	var sezioneMiniColonna = [[0,0],[faccMiniColonnaX,y2],[2*faccMiniColonnaX,y2],[3*faccMiniColonnaX,0],[3*faccMiniColonnaX+0.001,0]];

	var miniColonna = EXTRUDE([z45-z4])(POLYLINE(sezioneMiniColonna));
		miniColonna.translate([1,2],[0.001,z4]);

	var stecchettoBasso = SIMPLEX_GRID([[dimFregioX],[y1],[-z2,(z3-z2)]]);
	var stecchettoMedio = SIMPLEX_GRID([[dimFregioX],[y2],[-z45,(z5-z45)]]);
	var stecchettoAlto = SIMPLEX_GRID([[dimFregioX],[-0.15,y3-0.15],[-z5,(z6-z5)]]);

	var elementoFregio = STRUCT([miniColonna,pezzettino,pezzettino2]);

	var tf = T([0])([miniColonnaX]);

	var elementiFregio = STRUCT([elementoFregio,tf,elementoFregio,tf,elementoFregio]);

	var fregio = STRUCT([stecchettoBasso,stecchettoMedio,stecchettoAlto,elementiFregio]);

		fregio.scale([1],[-1]);
		fregio.color(coloreFregioSottoTimpano);

	return fregio;
}

var mkSottoTimpano = function(){

	var xPrimoFregio = 4/18;
	var distFregi = 7/9;

	var scorrimento = 0.3;
	var distacco = 0.16;
	var lportico = 14;
	var h = 1;

	var z1 = 4/15;
	var z2 = 12/15;
	var z3 = 15/15; 

	var y1 = 0;
	var y2 = 0.15;
	var y3 = 0.2;
	var y4 = 0.3;
	var y5 = 0.5;
	var y6 = 0.6;
	
	var profilo = [[0,0,0],[0,y2,0],[0,y2,h*(4/(3*15))],[0,y3,h*(4/(3*15))],[0,y3,h*(4-0.8)/15],[0,y4,h*(4-0.8)/15],[0,y4,h*z1],[0,y1,h*z1],


					[0,y1,h*(z2-(0.8/15))],[0,y2,h*(z2-(0.8/15))],[0,y2,h*(z2)],[0,y4,h*(z2)],[0,y4,h*(z2+(0.8/15))],[0,y5,h*(z2+(2.2/15))],[0,y5,h*(z2+(2.7/15))],[0,y6,h*(z3)],[0,y1,h*(z3)]];

	profilo = profilo.map(function(p){return [p[0],p[1]+distacco,p[2]];});
	
	var profiloObliquo = scorrimentoProfilo(profilo,-1*scorrimento,0,[0,y6+distacco,0,h]);
	var profiloAMuro = profiloObliquo.map(function(p){return [p[0],0,p[2]];});

	var profiloCentrale = profilo.map(function(p){return [p[0]+lportico/2,p[1],p[2]];})
	//var profilo3 = profilo.map(function(p){return [p[0]-lportico,p[1],p[2]];})


	var surf = mkNubSurfaceWithCPointsAndGrades([profiloCentrale,profiloObliquo,profiloAMuro],1,1);


	var dom2 = DOMAIN([[0,1],[0,1]])([profilo.length -1,2]);

	var mezzaBase = MAP(surf)(dom2);

	var fregio = mkFregioSottoTimpano();
		fregio.translate([0,1],[xPrimoFregio,-distacco]);

	var fregi = [fregio];
	
	for(var i = 0; i<8; i++){
		fregio = T([0])([distFregi])(fregio);
		fregi.push(fregio);
	}
		mezzaBase.scale([1],[-1]);
		mezzaBase.color(coloreTimpano);

	var mezzoSottoTimpano = STRUCT([mezzaBase,STRUCT(fregi)]);

	var secondaMeta = S([0])([-1])(mezzoSottoTimpano);
		secondaMeta.translate([0],[lportico]);

	var sottoTimpano = STRUCT([mezzoSottoTimpano,secondaMeta]);
	return sottoTimpano;
}


var mkPortico = function(){
		var profonditaCunetta = 2;
		var profonditaPorticoTeorica = 6.5;
		var profonditaColonne = 0.9;
		var profonditaPortico = profonditaPorticoTeorica-profonditaColonne;
		var lunghezzaCunetta = profonditaPorticoTeorica-2*profonditaColonne;
		var lportico = 14.6-2*profonditaCunetta;
		var hportico = 5.6;
		var hcupola = lunghezzaCunetta/2;
		var rCunetta = lunghezzaCunetta/2;
		var lportone = 2;
		var hportone = 3;
		var sforoSoffitto = 0.5;

		var mkCunetta = function () {
				var r = rCunetta;
				var hporta = 2.5;
				var lporta = 1.3;
				var hmuri = hportico;

				var domBassoA = DOMAIN([[0,r-(lporta/2)],[0,hporta]])(resMap["cunetta"]);
				var domBassoB = DOMAIN([[r+(lporta/2),2*r],[0,hporta]])(resMap["cunetta"]);

				var domAlto = DOMAIN([[0,2*r],[hporta,hmuri]])(resMap["cunettaAlta"]);

				var domCupola = DOMAIN([[0,2*r],[0,hcupola]])(resMap["cupolaPortico"]);

				var mappingMuro = function(p){
					var x = p[0];
													//equazione della circonferenza nel piano, ricavo y rispetto a x e il raggio.
					return [x,(profonditaCunetta/r)*Math.sqrt(r*r - ((x-r)*(x-r)) ),p[1]];
				};

				var mappingCupola = function(p){
					var x = p[0];
					var z = p[1];
										//calcolo la "componente" y a partire dalla z, come se fossero seno e coseno di un angolo, con la formula sin^2 + cos^2 = 1
						var yCupola = Math.sqrt(1 - (z/hcupola)*(z/hcupola) );

										//equazione della circonferenza nel piano, calcolo la curvatura della y rispetto a x
						var yCunetta = (profonditaCunetta/r)*Math.sqrt(r*r - ((x-r)*(x-r)) );

										//calcolo la curvatura della z rispetto a x
						var zCunetta = Math.sqrt(r*r - ((x-r)*(x-r)) )/r;

								//moltiplico i contributi di x e z sulla y, e scalo la z per la curvatura rispetto a x, ottengo una cupola senza aver utilizzato seni e coseni
					return [x,yCupola*yCunetta,z*zCunetta];
				}

				var arcoSottoA = MAP(mappingMuro)(domBassoA);
				var arcoSottoB = MAP(mappingMuro)(domBassoB);
				var arcoSopra = MAP(mappingMuro)(domAlto);
				var cupola = MAP(mappingCupola)(domCupola);
					cupola.translate([2],[hmuri]);

				var cunetta = STRUCT([arcoSopra,arcoSottoA,arcoSottoB,cupola]);
				return cunetta;
		}


		var cunettaA = mkCunetta();
			cunettaA.rotate([0,1],[PI/2]);
			cunettaA.translate([0,1],[0.01,profonditaColonne]);

		var cunettaB = S([0])([-1])(cunettaA);
			cunettaB.translate([0],[lportico]);

		var domSoffitto = DOMAIN([[0,lportico+2*sforoSoffitto],[0,2*rCunetta]])(resMap["soffittoPortico"]);
		var soffittoMapping = function(p){
			var x = p[0];
			var y = p[1];

			return [x,y,(hcupola/rCunetta)*Math.sqrt(rCunetta*rCunetta - ((y - rCunetta)*(y - rCunetta)) )];
		}
		var soffitto = MAP(soffittoMapping)(domSoffitto);
			soffitto.translate([0,1,2],[-sforoSoffitto,profonditaColonne,hportico-0.01]);


		var muroPorticoA = SIMPLEX_GRID([[(lportico-lportone)/2,-lportone,(lportico-lportone)/2],[-profonditaPortico,0.1],[hportico]]);
		var muroPorticoB = SIMPLEX_GRID([[-(lportico-lportone)/2,lportone 						],[-profonditaPortico,0.1],[-hportone,hportico-hportone]]);


		var portico = STRUCT([cunettaA,cunettaB,muroPorticoA,muroPorticoB,soffitto]);
			portico.translate([0],[profonditaCunetta-intermezzoTorreColonne]);
			portico.color(colorePortico);

		var muroDietroColonne = SIMPLEX_GRID([[0.8,0.1,0.8,0.3,-2.4,0.3,0.8,0.3,-2.4,0.3,0.8,0.3,-2.4,0.3,0.8,0.1,0.8],[profonditaColonne],[hportico]]);
			muroDietroColonne.color(coloreColonne);


			portico = STRUCT([portico,muroDietroColonne]);

		return portico;
	}


var mkColonnina = function(){

	var baseColonninaCP = [[1,1,0],[-1,1,0],[-1,-1,0],[1,-1,0],[1,1,0]];
	var colonninaCP = [[0,0,0.1],[0.065,0,0.1],[0.065,0,0.2],[0.035,0,0.23],[0.035,0,0.26],[0.065,0,0.3],[0.065,0,0.37],[0.035,0,0.53],[0.035,0,0.58],[0.045,0,0.63],[0.05,0,0.63],[0.05,0,0.65],[0,0,0.65]];



	var colonninaNub = mkNubG1(colonninaCP);
	var baseColonninaNub = mkNubG1(baseColonninaCP,S1);


	var dom12x4 = DOMAIN([[0,1],[0,1]])([colonninaCP.length-1,baseColonninaCP.length-1]);

	var profProd = PROFILEPROD_SURFACE([colonninaNub,baseColonninaNub]);

	var colonnina =  MAP(profProd)(dom12x4);

	return colonnina;
}

var mkMiniColonnato = function(){

	var lbloccoCentrale = 0.2;
	var lmancorrente = 1.2;
	var lcln = 0.13;
	var lspaz = 0.05;
	var lprimoSpazio = 0.15;
	var hcolonnina = 0.65;

	var cln = mkColonnina();
	cln.translate([0],[lcln/2 + lprimoSpazio]);

	var arrColonnine = [cln];

	for(i=0;i<5;i++){
		cln = T([0])([lcln+lspaz])(cln);
		arrColonnine.push(cln);
	}

	var colonnine = STRUCT(arrColonnine);

	var mancorrenteCP2D = [[0,0],[0,0.07],[0.025,0.09],[0.065,0.09],[0.075,0.125],[0.1,0.125],[0.1,0]];

	var mancorrente = EXTRUDE([lmancorrente])(POLYLINE(mancorrenteCP2D));
		mancorrente = STRUCT([mancorrente, S([1])([-1])(mancorrente)]);

		mancorrente.rotate([0,2],[-PI/2]);
		mancorrente.translate([0,2],[lmancorrente,hcolonnina]);

	var bloccoCentrale = SIMPLEX_GRID([[-(lmancorrente-0.1),lbloccoCentrale/2],[0.132],[-0.1,0.55]]);
		bloccoCentrale.translate([1],[-0.066]);

	var bloccoSotto = SIMPLEX_GRID([[1.2],[0.2],[0.1]]);
		bloccoSotto.translate([1],[-0.1]);

	var mezzoColonnato = STRUCT([colonnine,mancorrente,bloccoCentrale,bloccoSotto]);

	var secondoMezzoColonnato = S([0])([-1])(mezzoColonnato);
		secondoMezzoColonnato.translate([0],[lmancorrente*2]);

	var colonnato = STRUCT([mezzoColonnato,secondoMezzoColonnato]);
		colonnato.translate([1],[-0.125]);

	return colonnato;
}

var mkTettoVilla = function (){

	var eccedenzaTettoX = 0.7;
	var eccedenzaTettoY = 0.4;
	var dimFacY = 4.2;

	var xtettoA = 27.6+2*eccedenzaTettoX;
	var ytettoA = dimFacY*3 + 2*eccedenzaTettoY;
	var htettoA = 3.1;

	var xtettoB = 14.6;
	var ytettoB = 6.4;

	//calcolo l'altezza della parte B del tetto in modo che l'inclinazione sia la stessa della parte A
	//(quindi faccio in modo che il tetto B e metà del tetto A siano triangoli simili).
	var htettoB = (2*htettoA*ytettoB)/ytettoA;


	var xtettoC = xtettoB;
	var ytettoC = ytettoB;
	var htettoC = htettoB+0.7;

	var distPunteA = 15;

	var puntaA1 = [xtettoA/2 -distPunteA/2,ytettoA/2,htettoA];
	var puntaA2 = [xtettoA/2 +distPunteA/2,ytettoA/2,htettoA];
	var puntaB1 = [0,ytettoB,htettoB];
	var puntaB2 = [xtettoB,ytettoB,htettoB];
	var puntaC1 = [xtettoC/2,0,htettoC];
	var puntaC2 = [xtettoC/2,ytettoC+1.7,htettoC];

	var ftettoA = function(p){ //a partire da cuboid
		var x = p[0];
		var y = p[1];
		var z = p[2];

		if(z>0){
			if(x>0){return puntaA2;}
			else {	return puntaA1;}

		} else {return p;}
	}
	var ftettoB = function(p){ //a partire da cuboid
		var x = p[0];
		var y = p[1];
		var z = p[2];

		if(z==0 && y==0){
			return p;			
		} else if(x>0){
			return puntaB2;
		} else {
		  	return puntaB1;
		}
	}
	var ftettoC1 = function(p){ //a partire dal tetto B
		var x = p[0];
		var y = p[1];
		var z = p[2];

		if(z>0){
			if(x>0){ return puntaC2;}
			else {return [x,0,0];}
		} else if (x>0){ return puntaC1}
			   else {return p}
	}
			

	var tettoA = MAP(ftettoA)(CUBOID([xtettoA,ytettoA,htettoA]));

	var tettoB = MAP(ftettoB)(CUBOID([xtettoB,ytettoB,htettoB]));

	var tettoC1 = MAP(ftettoC1)(tettoB.clone());
	var tettoC2 = S([0])([-1])(tettoC1);
		tettoC2.translate([0],[xtettoC]);
	var tettoC = STRUCT([tettoC1,tettoC2]);

		tettoA.translate([1,2],[ytettoB,htettoB]);
		tettoA.color(coloreTetti);

		tettoB.translate([0],[xtettoA/2 - xtettoB/2]);
		tettoB.color(coloreTetti);

		tettoC.translate([0],[xtettoA/2 - xtettoC/2]);
		tettoC.color(coloreTetti);

	var puntale1 = mkPuntale();
		puntale1.translate([0,1,2],[puntaA1[0],puntaA1[1]+ytettoB,puntaA1[2]+htettoB-0.1]);
	var puntale2 = T([0])([distPunteA])(puntale1);


	return STRUCT([tettoA,tettoB,tettoC,puntale1,puntale2]);

}

var mkCornicioni = function(){

	var lvilla = 27.6;
	var hprof = 0.86;
	var lprof = 0.6;
	var profilo = [[0,(0)*lprof,(0)*hprof],[0,(0.35)*lprof,(0)*hprof],[0,(0.35)*lprof,(0.35)*hprof],[0,(0.45)*lprof,(0.5)*hprof],[0,(0.45)*lprof,(0.75)*hprof],[0,(0.8)*lprof,(0.75)*hprof],[0,(0.8)*lprof,(0.85)*hprof],[0,lprof,hprof],[0,0,hprof]];
	var profiloSchiacciato = profilo.map(function(p){return [p[0],p[1]/6,p[2]];});
	var profiloObliquoSchiacciato = scorrimentoProfilo(profiloSchiacciato,-lprof);

	var profiloObliquo1 = scorrimentoProfilo(profilo,-lprof);
	var profiloObliquo2 = traslaPunti(scalaPunti(profiloObliquo1,1,-1,1),0,-4.2*3,0);
	var profilo3 = traslaPunti(scalaPunti(profilo,1,-1,1),lvilla/2,-4.2*3,0);

	//var cps = [profilo,profiloObliquo1,profiloObliquo2,profilo3];
	var cps = [profiloSchiacciato,profiloObliquoSchiacciato,profiloObliquo2,profilo3];

	var surf = mkNubSurfaceWithCPointsAndGrades(cps,1,1);

	var mezzoCornicione = MAP(surf)(D11([profilo.length-1,3]));
		mezzoCornicione.translate([0],[-lvilla/2]);

	var secondoMezzoCornicione = S([0])([-1])(mezzoCornicione);

	var cornicione = STRUCT([mezzoCornicione,secondoMezzoCornicione]);
		cornicione.scale([1],[-1]);

	return cornicione;
}

//######################################################################## BUILD ##########################################################################

//------------------------------------
var torre = mkTorre();
//------------------------------------

//------------------------------------
var torre2 = torre.clone();
//------------------------------------
torre2.scale([0],[-1]);
torre2.translate([0],[27 + 0.3*2 + 0.3*2]);


var dimFac = 4.2;
var dimTorre = 6.5+0.3;
var dimColonna = 0.8;
var intermezzoColonnaColonna = 0.1;
var altezzaBecchiSottoTetto = 0.5;
var dimXVilla = 27.6;


var elFac = mkElementoFacciata();
var traslFac = T([0])([dimFac]);

//------------------------------------
var facciata = STRUCT([elFac,traslFac,elFac,traslFac,elFac]);
//------------------------------------

var intermezzoTorreFacciata = 0;
var intermezzoTorreColonne = 0.3;
var intermezzoColonneTimpano = 1;

facciata.rotate([0,1],[-PI/2]);
facciata.translate([1],[dimFac*3+dimTorre+intermezzoTorreFacciata]);

//------------------------------------
var facciata2 = S([0])([-1])(facciata);
//------------------------------------
facciata2.translate([0],[27 + 0.3*2 + 0.3*2]);

var colonna = mkColonna();
	colonna.translate([0,2],[0.3+6.5+intermezzoTorreColonne,2.2]);

	var tCol1 = T([0])([0.8 + intermezzoColonnaColonna]);
	var tCol2 = T([0])([3 + dimColonna]);

	colonna2 = colonna.clone().translate([0],[0.9]);
	colonna3 = colonna2.clone().translate([0],[3.8]);
	colonna4 = colonna3.clone().translate([0],[3.8]);
	colonna5 = colonna4.clone().translate([0],[3.8]);
	colonna6 = colonna5.clone().translate([0],[0.9]);

//------------------------------------
var colonne = STRUCT([colonna,colonna2,colonna3,colonna4,colonna5,colonna6]);
//------------------------------------

// la seguente STRUCT portava allo stesso risultato in modo molto più sintetico, ma meno efficiente:
//var colonne = STRUCT([colonna,tCol1,colonna,tCol2,colonna,tCol2,colonna,tCol2,colonna,tCol1,colonna]);

colonne.color(coloreColonne);

var arcata = mkArcata();
	arcata.translate([0,1,2],[dimTorre+intermezzoTorreColonne+dimColonna*2 +intermezzoColonnaColonna,0.2,2.2]);

var arcata2 = arcata.clone().translate([0],[3+dimColonna]);
var arcata3 = arcata2.clone().translate([0],[3+dimColonna]);

//------------------------------------
var arcate = STRUCT([arcata,arcata2,arcata3]);
//------------------------------------

//------------------------------------
var miniColonnato = mkMiniColonnato();
//------------------------------------
	miniColonnato.translate([0,1,2],[dimTorre+intermezzoTorreColonne+2*dimColonna+intermezzoColonnaColonna+0.3,0.3+0.25,2.2]);
	miniColonnato = STRUCT([miniColonnato,T([0])([2*3 + 2*dimColonna])(miniColonnato)]);
	miniColonnato.color(coloreColonne);

//------------------------------------
var timpano = mkTimpano();
//------------------------------------
var sottoTimpano = mkSottoTimpano();
	sottoTimpano.translate([0,1],[0.3,0.3]);

	timpano.translate([2],[intermezzoColonneTimpano]);
	timpano.color(coloreTimpano);

	timpano = STRUCT([timpano,sottoTimpano]);

	timpano.translate([0,1,2],[0.3+6.5,0.3,2.2+0.35*16]);

//------------------------------------
var portico = mkPortico();
//------------------------------------
	portico.translate([0,1,2],[dimTorre+intermezzoTorreColonne,0.3,2.2]);

//------------------------------------
var tetto = mkTettoVilla();
//------------------------------------
var ztetto = 2.2+0.35*16+1+0.1;
var offsetYTetto = 0.3;
var offsetXTetto = -0.4;
	tetto.translate([0,1,2],[offsetXTetto,offsetYTetto,ztetto]);

var cornicione = mkCornicioni();
	cornicione.translate([0,1,2],[0.3+dimXVilla/2,6.5+0.3,2.2+8+0.8]);

var villa = STRUCT([torre,facciata,torre2,facciata2,colonne,arcate,timpano,portico,miniColonnato,tetto,cornicione]);



DRAW(villa);
