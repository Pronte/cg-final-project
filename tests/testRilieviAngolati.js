


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


var mkBlocco = function(x,y,l,h,alfa,n,spess){


	var xx = x || 0;
	var yy = y || 0;
	var ll = l || 0.8;
	var hh = h || 0.35;
	var aa = alfa || 0;
	var nn = n || 4;
	var spessore = spess || 0.2;


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

var doubleCP = function(arr){

	var ret = [arr[0]];

	for(var i = 1; i<arr.length-1; i++){
		ret.push(arr[i]);
		ret.push(arr[i]);
	}
	ret.push(arr[arr.length-1]);

	return ret;
}

var mkArcata = function (){
		//var cpb0 = [[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.],[0.,0,0.]];
		//var cpb0 = [[-0.2,0,0.025],[0,0,0.025],[0.3,0,0.025],[0.3,0,0.125],[0.3,0,0.225],[0.3,0,0.325],[0,0,0.325],[-0.2,0,0.325],[-0.2,0,0.025]];
		//var cpb0 = [[-0.2,0,0.015],[0,0,0.015],[0.3,0,0.015],[0.3,0,0.125],[0.3,0,0.225],[0.3,0,0.335],[0,0,0.335],[-0.2,0,0.335],[-0.2,0,0.015]];
		var cpb0 = [[-0.2,0,0.01],[0,0,0.01],[0.3,0,0.01],[0.3,0,0.125],[0.3,0,0.225],[0.3,0,0.34],[0,0,0.34],[-0.2,0,0.34],[-0.2,0,0.01]];

		var cpb1 = doubleCP([[0,0,0],[0.3,0,0],[0.3,0,0.3],[0,0,0.4],[0,0,0]]);
		var cpb2 = doubleCP([[0.3,0,0.3],[0,0,0.4],[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.3,0,0.3]]);
		var cpb3 = doubleCP([[0,0,0.7],[0.1,0,0.7],[0.35,0,0.5],[0.5,0,0.8],[0.2,0,1.1],[0,0,1.1],[0,0,0.7]]);
		var cpb4 = doubleCP([[0.5,0,0.8],[0.2,0,1.1],[0.2,0,1.5],[0.6,0,1.5],[0.8,0,1.05],[0.5,0,0.8]]);
		var cpb5 = doubleCP([[0.6,0,1.5],[0.8,0,1.05],[1.1,0,1.2],[0.85,0,1.85],[0.6,0,1.85],[0.6,0,1.5]]);
		var cpb6 = doubleCP([[1.1,0,1.2],[0.85,0,1.85],[1.25,0,1.85],[1.35,0,1.25],[1.1,0,1.2]]);



		//var cpb4 = [[0.3,0,0],[0.6,0,0.25],[0.6,0,0.25],[0.35,0,0.7],[0.35,0,0.7],[0,0,0.7],[0,0,0.7],[0,0,0.35],[0,0,0.35],[0.3,0,0]];
		//b4.translate([2],[10]);


		var b0 = mkCustomBlocco(cpb0,0.2,6);
			b0.translate([2],[0.3]);
		var b0s = [b0];
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
		arco.translate([2],[0.35*10]);

		var arcataSx = STRUCT([colonnina,arco]);
		var arcataDx = arcataSx.clone().scale([0],[-1]).translate([0],[3]);

		var cpChiave = doubleCP([[1.25,0,1.85],[1.35,0,1.2],[1.4,0,1.1],[1.6,0,1.1],[1.65,0,1.2],[1.75,0,1.85],[1.25,0,1.85]]);
		var chiaveDiVolta = mkCustomBlocco(cpChiave,0.25,10,3);
			chiaveDiVolta.translate([2],[0.35*10]);

		var arcata = STRUCT([arcataSx,arcataDx,chiaveDiVolta]);
			arcata.translate([1],[0.2]);
		return arcata;
}


