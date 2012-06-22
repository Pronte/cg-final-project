


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

var mkCapitello = function(){

	var l = 0.8;
	var h = 0.3;

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

	var dom2 = DOMAIN([[0,1],[0,1]])([20,20]);

	var capitello = MAP(PROFILEPROD_SURFACE([profiloVert,profiloOrizz]))(dom2);
	
	capitello.rotate([0,1],[PI/2]);
	capitello.translate([0],[l/2]);

	return capitello;
};


var mkColonna = function (){
	var b = mkBlocco();
	var trasl = T([2])([0.35]);
	var capitello = mkCapitello();
	var capitelloAlto = S([2])([-1])(capitello);
	capitelloAlto.translate([2],[14*0.35 + 2*0.3]);

	var colonna = STRUCT(REPLICA(14)([b,trasl]));
	colonna.translate([2],[0.3]);
	colonna = STRUCT([colonna,capitello,capitelloAlto]);

	return colonna;
}

DRAW(mkColonna());
