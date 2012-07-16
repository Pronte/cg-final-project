//#################colori####################

var coloreIntonaco = [1.5,1.5,1.5]; 
var colorePavimenti = [244/250, 164/250, 96/250];
var coloreBordini = [245/250,245/250,245/250];
var coloreBordiniScuri = [225/250,225/250,225/250];
var coloreColonne = coloreBordiniScuri;


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

var resMap = resMapMedRes;

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

		var torre = STRUCT([muriTorre,pavimentoTorre,bordini,baseTorre]);

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
	//var knots = mkKnotsG2(cpoints);
	//var base = NUBS(S0)(2)(knots)(cpoints);


	var csopra = cpoints.map(function(p){return [p[0],spess,p[2]]});
	var sopra = mkNub(csopra,g,S0);
	//var sopra = NUBS(S0)(2)(knots)(csopra);



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
/*
var mkBlocco = function(x,y,l,h,alfa,n,spess){


	var xx = x || 0;
	var yy = y || 0;
	var ll = l || 0.8;
	var hh = h || 0.35;
	var aa = alfa || 0;
	var nn = n || 4;
	var spessore = spess || 0.3;


	var domain2 = DOMAIN([[0,1],[0,1]])([10,nn]);

//	var cbase = [[1,0,1],[0.3,0,1],[0,0,1],[0,0,0.5],[0,0,0],[0.3,0,0],[1.7,0,0],[2,0,0],[2,0,0.5],[2,0,1],[1.7,0,1],[1,0,1]];
	var cbase = [[ll/2,0,hh],[ll*0.3/2,0,hh],[0,0,hh],[0,0,hh/2],[0,0,0],[ll*0.3/2,0,0],[ll*1.7/2,0,0],[ll,0,0],[ll,0,hh/2],[ll,0,hh],[ll*1.7/2,0,hh],[ll/2,0,hh]];
	var knots = mkKnotsG2(cbase);
	var base = NUBS(S0)(2)(knots)(cbase);

	var csopra = cbase.map(function(p){return [p[0],spessore,p[2]]});
	var sopra = NUBS(S0)(2)(knots)(csopra);

	var puntoDiChiusura = function(){return [ll/2,spessore,hh/2];}

	var surf = BEZIER(S1)([base,sopra,sopra,puntoDiChiusura]);

	var dsurf = MAP(surf)(domain2);

	return dsurf;
} 
*/
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
	
	var cpVert = [[1,0,0],[1,0,h*0.05],[1,0,h*0.6],[0.5,0,h*0.7],[0.5,0,h*0.75],[0.7,0,h*0.85],[0.7,0,h*0.93],[0.5,0,h*1],[0,0,h*1]];


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

		var cpb1 = doubleCP([[0,0,0],[0.3,0,0],[0.3,0,0.3],[0,0,0.35],[0,0,0]]);
		var cpb2 = doubleCP([[0.3,0,0.3],[0,0,0.35],[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.3,0,0.3]]);
		var cpb3 = doubleCP([[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.5,0,0.8],[0.2,0,1.05],[0,0,1.05],[0,0,0.7]]);
		var cpb4 = doubleCP([[0.5,0,0.8],[0.2,0,1.05],[0,0,1.05],[0,0,1.4],[0.2,0,1.4],[0.6,0,1.4],[0.8,0,1.05],[0.5,0,0.8]]);
		var cpb5 = doubleCP([[0.6,0,1.4],[0.8,0,1.05],[1.1,0,1.2],[0.85,0,1.75],[0.6,0,1.75],[0.6,0,1.4]]);
		var cpb6 = doubleCP([[1.1,0,1.2],[0.85,0,1.75],[1.25,0,1.75],[1.35,0,1.25],[1.1,0,1.2]]);

		var cpb8 = doubleCP([[0,0,1.4],[0.6,0,1.4],[0.6,0,1.75],[0,0,1.75],[0,0,1.4]]);

		var cpChiave = doubleCP([[1.25,0,1.75],[1.35,0,1.2],[1.4,0,1.1],[1.6,0,1.1],[1.65,0,1.2],[1.75,0,1.75],[1.25,0,1.75]]);

		//var cpRetroArcoA = [[0,0,0],[0.3,0,0],[0.3,0,0],[0.3,0,0.3],[0.35,0,0.5],[0.5,0,0.8],[0.8,0,1.05],[1.1,0,1.2],[1.35,0,1.25],[1.4,0,1.25],[1.4,0,1.25],[1.4,0,1.75],[1.4,0,1.75],[0,0,1.75],[0,0,1.75],[0,0,0]];
		var cpRetroArcoA = [[0.3,0,0],[0.3,0,0.3],[0.35,0,0.5],[0.5,0,0.8],[0.8,0,1.05],[1.1,0,1.2],[1.35,0,1.25],[1.4,0,1.25],[1.4,0,1.25],[1.4,0,1.75],[1.4,0,1.75],[0.3,0,1.75],[0.3,0,1.75],[0.3,0,0]];
		var cpRetroArcoB = traslaPunti(cpRetroArcoA,0,0.8,0);
		var pDiChiusuraA = [0.3,0,1.7];
		var pDiChiusuraB = [0.3,0.8,1.7];

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
			retroArco.translate([0,1,2],[0,0,0.35*11 + 0.01]);

		var arcataSx = STRUCT([colonnina,arco,blocchiSquadrati,retroArco]);
		var arcataDx = arcataSx.clone().scale([0],[-1]).translate([0],[3]);

		var chiaveDiVolta = mkCustomBlocco(cpChiave,0.25,bCircularDetail,3);
			chiaveDiVolta.translate([2],[0.35 + 0.35*10]);
			chiaveDiVolta.scale([1],[-1]);
		
		var retroChiave = mkCustomBlocco(cpChiave,0.9,bCircularDetail,4);
			retroChiave.translate([2],[0.35 + 0.35*10]);


		var arcata = STRUCT([arcataSx,arcataDx,chiaveDiVolta,retroChiave]);
			arcata.translate([1],[0.2]);
		return arcata;
}


var mkTimpano = function(){
		var dom14x2 = DOMAIN([[0,1],[0,1]])([14,2]);
		var dom14x1 = DOMAIN([[0,1],[0,1]])([14,1]);


		var cpCornicione = [[0,0,0],[0,0.1,0],[0,0.1,0.1],[0,0.2,0.1],[0,0.2,0.2],[0,0.4,0.7],[0,0.5,0.7],[0,0.5,0.8],[0,0.6,0.8],[0,0.6,1],[0,0.7,1],[0,0.7,1.1],[0,0.8,1.1],[0,0.8,1.2],[0,0,1.2]];
		var cpCornicioneBasso = [[0,0,0],[0,0.55,0],[0,0.55,0.2],[0,0.6,0.2],[0,0.6,0.25],[0,0.75,0.4],[0,0.8,0.4],[0,0.8,0.5],[0,0,0.5]];


		var eccedenzaCornicioneAlto = 0.3;
		var lunghezzaTimpano = 14.6;
		var lunghezzaTimpanoAlto = lunghezzaTimpano + 2*eccedenzaCornicioneAlto;
		var altezzaPunta = 3;

		var scorrimentoTimpano = 1;
		var cpMinMaxes = [0,0.8,0,1.2];// si potrebbe ottimizzare con "cpCornicione.reduce(function);"

		var fpunta = function(p){ return [p[0]+lunghezzaTimpanoAlto/2, p[1],p[2]+(altezzaPunta)];}
		var frevX = function(p){ return [-p[0], p[1],p[2]]}
		var ftrasl = function (x,y,z){return function(p){return [p[0]+x,p[1]+y,p[2]+z]}; }


		var cpPunta = cpCornicione.map(fpunta);

		var cpAngoloDX = cpCornicione.map(ftrasl(scorrimentoTimpano,0,0));

		var cpAngoloDXPiegato = proiezioneConCombinazioneLineare(cpPunta,cpAngoloDX,scorrimentoTimpano);

		var cpAngoloSXPiegato = cpAngoloDXPiegato.map(frevX).map(ftrasl(lunghezzaTimpanoAlto,0,0));

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


		var cpCornicioneBassoDX = cpCornicioneBasso.map(ftrasl(eccedenzaCornicioneAlto,0,0));
		var cpCornicioneBassoSX = cpCornicioneBassoDX.map(ftrasl(lunghezzaTimpano,0,0));

		var cornicioneBassoMap = mkNubG1SurfaceWithCPoints([cpCornicioneBassoSX,cpCornicioneBassoDX]);
		var cornicioneBasso = MAP(cornicioneBassoMap)(dom14x1);

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

		var muroDietroColonne = SIMPLEX_GRID([[0.8,0.1,0.8,0.3,-2.4,0.3,0.8,0.3,-2.4,0.3,0.8,0.3,-2.4,0.3,0.8,0.1,0.8],[profonditaColonne],[hportico]]);



			portico = STRUCT([portico,muroDietroColonne]);

		return portico;
	}

//######################################################################## BUILD

var torre = mkTorre();

var torre2 = torre.clone();
torre2.scale([0],[-1]);
torre2.translate([0],[27 + 0.3*2 + 0.3*2]);


var dimFac = 4.2;
var dimTorre = 6.5+0.3;
var dimColonna = 0.8;
var intermezzoColonnaColonna = 0.1;


var elFac = mkElementoFacciata();
var traslFac = T([0])([dimFac]);

var facciata = STRUCT([elFac,traslFac,elFac,traslFac,elFac]);

var intermezzoTorreFacciata = 0;
var intermezzoTorreColonne = 0.3;
var intermezzoColonneTimpano = 1;

facciata.rotate([0,1],[-PI/2]);
facciata.translate([1],[dimFac*3+dimTorre+intermezzoTorreFacciata]);

var facciata2 = S([0])([-1])(facciata);
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

var colonne = STRUCT([colonna,colonna2,colonna3,colonna4,colonna5,colonna6]);

// la seguente STRUCT portava allo stesso risultato in modo molto più sintetico, ma meno efficiente:
//var colonne = STRUCT([colonna,tCol1,colonna,tCol2,colonna,tCol2,colonna,tCol2,colonna,tCol1,colonna]);

colonne.color(coloreColonne);

var arcata = mkArcata();
	arcata.translate([0,1,2],[0.3+6.5+intermezzoTorreColonne+dimColonna*2 +intermezzoColonnaColonna,0.2,2.2]);

var arcata2 = arcata.clone().translate([0],[3+dimColonna]);
var arcata3 = arcata2.clone().translate([0],[3+dimColonna]);

var arcate = STRUCT([arcata,arcata2,arcata3]);
	arcate.color(coloreColonne);

var timpano = mkTimpano();
	timpano.translate([0,1,2],[0.3+6.5,0.3,2.2+0.35*16+intermezzoColonneTimpano]);
	timpano.color(coloreColonne);

var portico = mkPortico();
	portico.translate([0,1,2],[dimTorre+intermezzoTorreColonne,0.3,2.2]);

var villa = STRUCT([torre,facciata,torre2,facciata2,colonne,arcate,timpano,portico]);

//DRAW(colonne);

DRAW(villa);