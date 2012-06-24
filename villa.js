var coloreIntonaco = [1.5,1.5,1.5]; 
var colorePavimenti = [244/250, 164/250, 96/250];
var coloreBordini = [245/250,245/250,245/250];
var coloreBordiniScuri = [225/250,225/250,225/250];
var coloreColonne = coloreBordiniScuri;



//#################utilities#################


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

var mkNubG2 = function(cp){
	return NUBS(S0)(2)(mkKnotsG2(cp))(cp);
}
var mkNubG1 = function(cp){
	return NUBS(S0)(1)(mkKnotsG1(cp))(cp);
}


var scorrimentoProfilo = function(cp,scorrXY,scorrXZ){ //scorrimento di X relativo a Y, scorrimento di X relativo a Z
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

	return cp.map(function(p){return [p[0]+(sxy*(p[1]/ymax))+(sxz*(p[2]/zmax)),p[1],p[2]];});
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
//#########################################


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

var mkCapitello = function(){

	var l = 0.8;
	var h = 0.35;

	lcurv = 0.4;
	hcurv = 0.8;

	var spess = 0.2;

	//var cstandard = [[0,0,0]/*,[0,h*(1-hcurv),0]*/,[0,h,0],[l*(lcurv),h,0],[l*(1-lcurv),h,0],[l,h,0],/*[l,h*(1-hcurv),0],*/[l,0,0]];
	var cpOrizz = [[0,0,0],[0,h*(1-hcurv),0],[0,h,0],[l*(lcurv),h,0],[l*(1-lcurv),h,0],[l,h,0],[l,h*(1-hcurv),0],[l,0,0]];
	cpOrizz = cpOrizz.map(function(p){return [p[1],p[0],p[2]];});

	//var cpVert = [[0,spess*0.5,0],[0,spess*1.5,h*0.1],[0,spess*1.5,h*0.4],[0,spess*0.5,h*0.5],[0,spess*0.5,h*0.6],[0,spess*0.85,h*0.8],[0,spess*0.85,h*0.9],[0,spess*0.5,h*1],[0,spess*0,h*1]];
	var cpVert = [[0,0.5,0],[0,1,h*0.05],[0,1,h*0.6],[0,0.5,h*0.7],[0,0.5,h*0.75],[0,0.7,h*0.85],[0,0.7,h*0.93],[0,0.5,h*1],[0,0,h*1]];
	cpVert = cpVert.map(function(p){return [p[1],p[0],p[2]];});

	//var cbase = cstandard.map(function(p){return [p[0],p[1],p[2]];});
	//var cbase = cstandard.map(function(p){return [((p[0]-l/2)*0.5 + (l/2)),p[1]*0.4,p[2]];});
	var ctrasl = cpOrizz.map(function(p){return [p[0],(p[1]-l/2),p[2]];});

	//DRAW(MAP(NUBS(S0)(2)(mkKnotsG2(cpOrizz))(cpOrizz))(INTERVALS(1)(16)));
	//DRAW(MAP(NUBS(S0)(2)(mkKnotsG2(ctrasl))(ctrasl))(INTERVALS(1)(16)));
	//DRAW(MAP(NUBS(S0)(2)(mkKnotsG2(cpVert))(cpVert))(INTERVALS(1)(16)));
	

	//	var profiloVert = BEZIER(S0)([[0,0,0],[2,0,0],[0,0,4],[1,0,5]]);
	var profiloVert = NUBS(S0)(2)(mkKnotsG2(cpVert))(cpVert);
	//var profiloVert = BEZIER(S0)(cpVert);
	//	var profiloOrizz = NUBS(S1)(2)(mkKnotsG2(ctrasl))(ctrasl);
	var profiloOrizz = NUBS(S1)(2)(mkKnotsG2(ctrasl))(ctrasl);

	var dom2 = DOMAIN([[0,1],[0,1]])([20,15]);

	var capitello = MAP(PROFILEPROD_SURFACE([profiloVert,profiloOrizz]))(dom2);
	
	capitello.rotate([0,1],[PI/2]);
	capitello.translate([0],[l/2]);

	return capitello;
};


var mkColonna = function (){
	var hcapitello = 0.35;

	var b = mkBlocco();
	//var trasl = T([2])([0.35]);
	var capitello = mkCapitello();
	var capitelloAlto = S([2])([-1])(capitello);
	capitelloAlto.translate([2],[14*0.35 + 2*hcapitello]);
	b.translate([2],[hcapitello]);

	//var colonna = STRUCT(REPLICA(14)([b,trasl]));
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

var mkCustomBlocco = function (cpoints,spessore,n,durezzaCurva){ //control points sul piano X,Z ! (y = 0 per ogni punto)
	if(cpoints == undefined){
		console.log("NO CONTROL POINTS FOR THIS BLOCK!")
		return undefined;
	}

	var spess = spessore || 0.2;
	var nn = n || 8;
	var durezza = durezzaCurva || 2;

	spess = spess*-1;

	var domain2 = DOMAIN([[0,1],[0,1]])([nn,4]);
	//var dom1 = INTERVALS(1)(20);

	var knots = mkKnotsG2(cpoints);
	var base = NUBS(S0)(2)(knots)(cpoints);

	//DRAW(MAP(base)(dom1));

	var csopra = cpoints.map(function(p){return [p[0],spess,p[2]]});
	var sopra = NUBS(S0)(2)(knots)(csopra);

	//DRAW(MAP(sopra)(dom1));


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


var mkArcata = function (){
		//var cpb0 = [[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.]];
		//var cpb0 = [[-0.2,0,0.025],[0,0,0.025],[0.3,0,0.025],[0.3,0,0.125],[0.3,0,0.225],[0.3,0,0.325],[0,0,0.325],[-0.2,0,0.325],[-0.2,0,0.025]];
		//var cpb0 = [[-0.2,0,0.015],[0,0,0.015],[0.3,0,0.015],[0.3,0,0.125],[0.3,0,0.225],[0.3,0,0.335],[0,0,0.335],[-0.2,0,0.335],[-0.2,0,0.015]];
		var cpb0 = [[-0.2,0,0.01],[0,0,0.01],[0.3,0,0.01],[0.3,0,0.125],[0.3,0,0.225],[0.3,0,0.34],[0,0,0.34],[-0.2,0,0.34],[-0.2,0,0.01]];

		var cpb1 = doubleCP([[0,0,0],[0.3,0,0],[0.3,0,0.3],[0,0,0.35],[0,0,0]]);
		var cpb2 = doubleCP([[0.3,0,0.3],[0,0,0.35],[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.3,0,0.3]]);
		var cpb3 = doubleCP([[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.5,0,0.8],[0.2,0,1.05],[0,0,1.05],[0,0,0.7]]);
		var cpb4 = doubleCP([[0.5,0,0.8],[0.2,0,1.05],[0.2,0,1.4],[0.6,0,1.4],[0.8,0,1.05],[0.5,0,0.8]]);
		var cpb5 = doubleCP([[0.6,0,1.4],[0.8,0,1.05],[1.1,0,1.2],[0.85,0,1.75],[0.6,0,1.75],[0.6,0,1.4]]);
		var cpb6 = doubleCP([[1.1,0,1.2],[0.85,0,1.75],[1.25,0,1.75],[1.35,0,1.25],[1.1,0,1.2]]);



		//var cpb4 = [[0.3,0,0],[0.6,0,0.25],[0.6,0,0.25],[0.35,0,0.7],[0.35,0,0.7],[0,0,0.7],[0,0,0.7],[0,0,0.35],[0,0,0.35],[0.3,0,0]];
		//b4.translate([2],[10]);


		var b0 = mkCustomBlocco(cpb0,0.2,6);
		var b0s = [b0];
			b0.translate([2],[0.35]);

		for(var i = 0; i<8; i++){
			b0 = b0.clone().translate([2],[0.35]);
			b0s.push(b0);
		}
		var colonnina = STRUCT(b0s);

		var b1 = mkCustomBlocco(cpb1,0.2,10);
		var b2 = mkCustomBlocco(cpb2,0.2,10);
		var b3 = mkCustomBlocco(cpb3,0.2,10);
		var b4 = mkCustomBlocco(cpb4,0.2,10);
		var b5 = mkCustomBlocco(cpb5,0.2,10);
		var b6 = mkCustomBlocco(cpb6,0.2,10);
			
		var arco = STRUCT([b1,b2,b3,b4,b5,b6]);
		arco.translate([2],[0.35 + 0.35*10]);

		var arcataSx = STRUCT([colonnina,arco]);
		var arcataDx = arcataSx.clone().scale([0],[-1]).translate([0],[3]);

		var cpChiave = doubleCP([[1.25,0,1.75],[1.35,0,1.2],[1.4,0,1.1],[1.6,0,1.1],[1.65,0,1.2],[1.75,0,1.75],[1.25,0,1.75]]);
		var chiaveDiVolta = mkCustomBlocco(cpChiave,0.25,10,3);
			chiaveDiVolta.translate([2],[0.35 + 0.35*10]);

		var arcata = STRUCT([arcataSx,arcataDx,chiaveDiVolta]);
			arcata.translate([1],[0.2]);
		return arcata;
}


//######################################################################## BUILD

var torre = STRUCT([muriTorre,pavimentoTorre,bordini,baseTorre]);

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
//var colonne = STRUCT([colonna,tCol1,colonna,tCol2,colonna,tCol2,colonna,tCol2,colonna,tCol1,colonna]);
colonne.color(coloreColonne);

var arcata = mkArcata();
	arcata.translate([0,1,2],[0.3+6.5+intermezzoTorreColonne+dimColonna*2 +intermezzoColonnaColonna,0.2,2.2]);

var arcata2 = arcata.clone().translate([0],[3+dimColonna]);
var arcata3 = arcata2.clone().translate([0],[3+dimColonna]);

var arcate = STRUCT([arcata,arcata2,arcata3]);
arcate.color(coloreColonne);

var villa = STRUCT([torre,facciata,torre2,facciata2,colonne,arcate]);

DRAW(villa);