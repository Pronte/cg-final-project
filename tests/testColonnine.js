
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
		throw "arrays' lengths differ, cannot combine";
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

	var lcln = 0.13;
	var lspaz = 0.05;

	var cln = mkColonnina();
	cln.translate([0],[lcln/2 + lspaz]);

	var arrColonnine = [cln];

	for(i=0;i<5;i++){
		cln = T([0])([lcln+lspaz])(cln);
		arrColonnine.push(cln);
	}

	var colonnine = STRUCT(arrColonnine);

	return STRUCT([colonnine]);
}

var colonnato = mkMiniColonnato();

DRAW(colonnato);
