


//var simpledom = DOMAIN([[0,2],[0,1],[0,2]])([50,1,1])

//var domBasso = SIMPLEX_GRID([[0.1,0.1,0.1,0.1,0.1,0.1,0.1,-1.3,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.5],[1.7]]);

//var domBassoA = DOMAIN([[],[]])([,]);


var profonditaCunetta = 2;
var profonditaPortico = 6.5;
var profonditaColonne = 0.8;
var lunghezzaCunetta = profonditaPortico-2*0.9; //TODO!!!!
var lportico = 14.6-2*profonditaCunetta;
var hportico = 5;
var lportone = 2;
var hportone = 3;

var mkCunetta = function () {
		var r = lunghezzaCunetta/2;
		var hporta = 2.5;
		var lporta = 1.3;
		var htot = hportico;

		var domBassoA = DOMAIN([[0,r-(lporta/2)],[0,hporta]])([10,1]);
		var domBassoB = DOMAIN([[r+(lporta/2),2*r],[0,hporta]])([10,1]);

		var domAlto = DOMAIN([[0,2*r],[hporta,htot]])([25,1]);

		var mapping = function(p){
			var x = p[0];
			return [x,(profonditaCunetta/r)*Math.sqrt(r*r - ((x-r)*(x-r)) ),p[1]];
		};

		var arcoSottoA = MAP(mapping)(domBassoA);
		var arcoSottoB = MAP(mapping)(domBassoB);
		var arcoSopra = MAP(mapping)(domAlto);

		var cunetta = STRUCT([arcoSopra,arcoSottoA,arcoSottoB]);
		return cunetta;
}


var cunettaA = mkCunetta();
	cunettaA.rotate([0,1],[PI/2]);

var cunettaB = S([0])([-1])(cunettaA);
	cunettaB.translate([0],[lportico]);
	

var muroPorticoA = SIMPLEX_GRID([[(lportico-lportone)/2,-lportone,(lportico-lportone)/2],[-profonditaPortico,0.1],[hportico]]);
var muroPorticoB = SIMPLEX_GRID([[-(lportico-lportone)/2,lportone 						],[-profonditaPortico,0.1],[-hportone,hportico-hportone]]);

var muroDietroColonne = SIMPLEX_GRID([[0.8,0.1,0.8,0.2,-2.6,0.2,0.8,0.2,-2.6,0.2,0.8,0.2,-2.6,0.2,0.8,0.1,0.8],[0.1],[hportico]]);


var portico = STRUCT([cunettaA,cunettaB,muroPorticoA,muroPorticoB]);
	portico.translate([0],[profonditaCunetta]);

	portico = STRUCT([portico,muroDietroColonne]);


DRAW(portico);