

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


var scorrimentoProfilo = function(cp,scorrXY,scorrXZ){ //scorrimento X relaivo a Y, scorrimento X relativo a Z
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

var bez = function(cp){
	return BEZIER(S0)(cp);
};

var mkNubG2 = function(cp){
	return NUBS(S0)(2)(mkKnotsG2(cp))(cp);
}
var mkNubG1 = function(cp){
	return NUBS(S0)(1)(mkKnotsG1(cp))(cp);
}

var dom = INTERVALS(1)(13);

var cpCornicione = [[0,0,0],[0,0.1,0],[0,0.1,0.1],[0,0.2,0.1],[0,0.2,0.7],[0,0.5,0.7],[0,0.5,0.8],[0,0.6,0.8],[0,0.6,1],[0,0.7,1],[0,0.7,1.1],[0,0.8,1.1],[0,0.8,1.2],[0,0,1.2]];
var cpCurvaCornicione = [[0,0.2,0.2],[0,0.35,0.2],[0,0.35,0.7],[0,0.5,0.7]];




//DRAW(MAP(bez(bezCP)) (dom) );
DRAW(MAP(nub2(nubCP)) (dom) );

//DRAW(POLYLINE(cp));
DRAW(MAP(nub1(cp))(dom) );

//var cp = [[0,0,0],[0,1,0],[0,1,1],[0,2,2],[0,2,2.5],[0,2.5,2.5],[0,0,3]];
//var cpl2 = scorrimentoCP(cp,1,0);
//var cpl3 = scorrimentoCP(cp,0,1);


//var l1 = POLYLINE(cp);
//var l2 = POLYLINE(cpl2);
//var l3 = POLYLINE(cpl3);

//l2.color([1,0,0]);
//l3.color([0,0,1]);


//DRAW(l1);
//DRAW(l2);
//DRAW(l3);