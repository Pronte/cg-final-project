

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


var mkNubG2 = function(cp,sel){
	sel = sel || S0;
	return NUBS(sel)(2)(mkKnotsG2(cp))(cp);
}
var mkNubG1 = function(cp,sel){
	sel = sel || S0;
	return NUBS(sel)(1)(mkKnotsG1(cp))(cp);
}

var mkNubG1SurfaceWithCPoints = function (cps){
	var handles = cps.map(function(cp){return mkNubG1(cp,S0);});
	return mkNubG1(handles,S1);
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

var mkBezier = function(cp,sel){
	sel = sel || S0;
	return BEZIER(sel)(cp);
};


var mkTimpano = function(){
		var dom14 = INTERVALS(1)(14);
		var dom14x2 = DOMAIN([[0,1],[0,1]])([14,2]);
		var dom14x1 = DOMAIN([[0,1],[0,1]])([14,1]);

		//var cpCornicione = [[0,0,0],[0,0.1,0],[0,0.1,0.1],[0,0.2,0.1],[0,0.2,0.7],[0,0.5,0.7],[0,0.5,0.8],[0,0.6,0.8],[0,0.6,1],[0,0.7,1],[0,0.7,1.1],[0,0.8,1.1],[0,0.8,1.2],[0,0,1.2]];
		//var cpCurvaCornicione = [[0,0.2,0.2],[0,0.35,0.2],[0,0.35,0.7],[0,0.5,0.7]];
		var cpCornicione = [[0,0,0],[0,0.1,0],[0,0.1,0.1],[0,0.2,0.1],[0,0.2,0.2],[0,0.4,0.7],[0,0.5,0.7],[0,0.5,0.8],[0,0.6,0.8],[0,0.6,1],[0,0.7,1],[0,0.7,1.1],[0,0.8,1.1],[0,0.8,1.2],[0,0,1.2]];
		var cpCornicioneBasso = [[0,0,0],[0,0.55,0],[0,0.55,0.2],[0,0.6,0.2],[0,0.6,0.25],[0,0.75,0.4],[0,0.8,0.4],[0,0.8,0.5],[0,0,0.5]];


		var eccedenzaCornicioneAlto = 0.3;
		var lunghezzaTimpano = 14.6;
		var lunghezzaTimpanoAlto = lunghezzaTimpano + 2*eccedenzaCornicioneAlto;
		var altezzaPunta = 3;
		//var dimZCornicione = 1.2;
		var scorrimentoTimpano = 1;
		var cpMinMaxes = [0,0.8,0,1.2];//cpCornicione.reduce(function);

		var fpunta = function(p){ return [p[0]+lunghezzaTimpanoAlto/2, p[1],p[2]+(altezzaPunta)];}
		var frevX = function(p){ return [-p[0], p[1],p[2]]}
		var ftrasl = function (x,y,z){return function(p){return [p[0]+x,p[1]+y,p[2]+z]}; }


		var cpPunta = cpCornicione.map(fpunta);
		//var cpCurvaPunta = cpCurvaCornicione.map(fpunta);

		////var cpAngoloSX = cpCornicione; //scorrimentoProfilo(cpCornicione,0,scorrimentoTimpano);
		////var cpCurvaAngoloSX = cpCurvaCornicione; //scorrimentoProfilo(cpCurvaCornicione,0,scorrimentoTimpano,cpMinMaxes);
		var cpAngoloDX = cpCornicione.map(ftrasl(scorrimentoTimpano,0,0));
		//var cpCurvaAngoloDX = cpCurvaCornicione.map(ftrasl(scorrimentoTimpano,0,0));

		var cpAngoloDXPiegato = proiezioneConCombinazioneLineare(cpPunta,cpAngoloDX,scorrimentoTimpano);
		//var cpCurvaAngoloDXPiegato = proiezioneConCombinazioneLineare(cpCurvaPunta,cpCurvaAngoloDX,scorrimentoTimpano,cpMinMaxes);

		var cpAngoloSXPiegato = cpAngoloDXPiegato.map(frevX).map(ftrasl(lunghezzaTimpanoAlto,0,0));
		//var cpCurvaAngoloSXPiegato = cpCurvaAngoloDXPiegato.map(frevX).map(ftrasl(lunghezzaTimpanoAlto,0,0));

		var cornTimpanoCPS = [cpAngoloSXPiegato,cpPunta,cpAngoloDXPiegato];
		//var curvaCornTimpanoCPS = [cpCurvaAngoloSXPiegato,cpCurvaPunta,cpCurvaAngoloDXPiegato];

		//var cornTimpano = mkNubG1(cornTimpanoCPS.map(function(cp){return mkNubG1(cp,S0);}),S1);
		  var cornTimpano = mkNubG1SurfaceWithCPoints(cornTimpanoCPS);	
		//var curvaCornTimpano = mkNubG1(curvaCornTimpanoCPS.map(function(cp){return mkNubG1(cp,S0);}),S1);

		var cornicioneTimpano = MAP (cornTimpano)(dom14x2);
		//var curvaCornicioneTimpano = MAP(curvaCornTimpano)(DOMAIN([[0,1],[0,1]])([8,2]));

		//var cornicioneTimpano = STRUCT([cornicioneTimpanoDritto,curvaCornicioneTimpano]);

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

DRAW(mkTimpano());
