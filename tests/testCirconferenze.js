


//var simpledom = DOMAIN([[0,2],[0,1],[0,2]])([50,1,1])

//var domBasso = SIMPLEX_GRID([[0.1,0.1,0.1,0.1,0.1,0.1,0.1,-1.3,0.1,0.1,0.1,0.1,0.1,0.1,0.1],[0.5],[1.7]]);

//var domBassoA = DOMAIN([[],[]])([,]);


var intermezzoTorreColonne = 0.3;

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

		var mkCunetta = function () {
				var r = rCunetta;
				var hporta = 2.5;
				var lporta = 1.3;
				var hmuri = hportico;

				var domBassoA = DOMAIN([[0,r-(lporta/2)],[0,hporta]])([10,1]);
				var domBassoB = DOMAIN([[r+(lporta/2),2*r],[0,hporta]])([10,1]);

				var domAlto = DOMAIN([[0,2*r],[hporta,hmuri]])([28,1]);

				var domCupola = DOMAIN([[0,2*r],[0,hcupola]])([28,28]);

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
			cunettaA.translate([1],[profonditaColonne]);

		var cunettaB = S([0])([-1])(cunettaA);
			cunettaB.translate([0],[lportico]);
		

		var domSoffitto = DOMAIN([[0,lportico+1],[0,2*rCunetta]])([1,28]);
		var soffittoMapping = function(p){
			var x = p[0];
			var y = p[1];

			return [x,y,(hcupola/rCunetta)*Math.sqrt(rCunetta*rCunetta - ((y - rCunetta)*(y - rCunetta)) )];
		}
		var soffitto = MAP(soffittoMapping)(domSoffitto);
			soffitto.translate([0,1,2],[-0.5,profonditaColonne,hportico-0.01]);


		var muroPorticoA = SIMPLEX_GRID([[(lportico-lportone)/2,-lportone,(lportico-lportone)/2],[-profonditaPortico,0.1],[hportico]]);
		var muroPorticoB = SIMPLEX_GRID([[-(lportico-lportone)/2,lportone 						],[-profonditaPortico,0.1],[-hportone,hportico-hportone]]);



		var portico = STRUCT([cunettaA,cunettaB,muroPorticoA,muroPorticoB,soffitto]);
			portico.translate([0],[profonditaCunetta-intermezzoTorreColonne]);

		var muroDietroColonne = SIMPLEX_GRID([[0.8,0.1,0.8,0.3,-2.4,0.3,0.8,0.3,-2.4,0.3,0.8,0.3,-2.4,0.3,0.8,0.1,0.8],[profonditaColonne],[hportico]]);



			portico = STRUCT([portico,muroDietroColonne]);

		return portico;
	}


DRAW(mkPortico());