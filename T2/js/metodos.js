function simplexDuasFases(a, b, c, base, artificiais){
	var ca = [];

	if(artificiais.length > 0){

		for(var i = 0; i < c.length; i++)
			ca[i] = artificiais.includes(i) ? 1 : 0;

		simplex(a, b, ca, base, artificiais, false);

		for(var i = 0; i < base.length; i++){
			if(artificiais.includes(base[i]) && b[i] == 0){
				b.splice(i, 1);
				a.splice(i, 1);
				base.splice(i, 1);
			}
		}
 
		for(var i = 0; i<a.length; i++)
			for(var j = 0; j<artificiais.length; j++)
					a[i].splice(artificiais[j], 1);

		for(var i = 0; i<artificiais.length; i++){
			c.splice(artificiais[i], 1);
		}
	}

	$("#iteracoes").append('<h3 class="text-center">Fim da primeira fase.</h3>');


	return simplex(a, b, c, base, artificiais, true);
}

function simplex(a, b, c, base, artificiais, segundaFase) {
	var jMaisNegativo = 0, iMenorPositivo = 0, cr = [], ba = [], x = [], nfp, nr;

	nr = a.length;
	nfp = a[0].length;

	for(var i=0; i<c.length; i++)
		cr[i] = c[i];

	if(segundaFase){
		for(var j = 0; j<nfp; j++){
			cr[j] = c[j];
			for(var i = 0; i<nr; i++){
				cr[j] -= c[base[i]]*a[i][j];
			}
		}
	}else{
		for(var i = 0; i < artificiais.length; i++){
			for(var j = 0; j < base.length; j++){
				if(base[j] == artificiais[i]){
					for(var k = 0; k < cr.length; k++)
						cr[k] -= a[j][k];
				}
			}
		}
	}

	while(true){

		var maisNegativo = 0;
		for(var i = 0; i<nfp; i++){
			if(cr[i] < maisNegativo){
				maisNegativo = cr[i];
				jMaisNegativo = i;
			}
		}

		var menorPositivo = Infinity;
		for(var i = 0; i<nr; i++){
			var bsa = b[i]/a[i][jMaisNegativo];
			ba[i] = bsa;
			if(bsa >= 0 && bsa < menorPositivo){
				menorPositivo = bsa;
				iMenorPositivo = i;
			}
		}

		mostraIteracao(a, b, base, ba, c, cr, nr);

		if(maisNegativo >= 0){
			for(var i = 0; i < artificiais.length; i++){
				for(var j = 0; j < base.length; j++){
					if(base[j] == artificiais[i] && b[j] != 0){
						return null;
					}
				}
			}
			break;
		}

		if(menorPositivo == Infinity){
			for(var i = 0; i < artificiais.length; i++){
				for(var j = 0; j < base.length; j++){
					if(base[j] == artificiais[i] && b[j] != 0){
						return null;
					}
				}
			}
			break;
		}

		base[iMenorPositivo] = jMaisNegativo;

		var pivo = a[iMenorPositivo][jMaisNegativo];

		for(var j = 0; j<nfp; j++){
			a[iMenorPositivo][j] /= pivo;
		}
		b[iMenorPositivo] /= pivo;

		for(var i = 0; i<nr; i++){
			if(i != iMenorPositivo){
				var m = a[i][jMaisNegativo]/a[iMenorPositivo][jMaisNegativo];
				for(var j = 0; j<nfp; j++){
					a[i][j] -= m*a[iMenorPositivo][j];
				}
				b[i] -= m*b[iMenorPositivo];
			}
		}
		
		for(var j = 0; j<nfp; j++){
			cr[j] = c[j];
			for(var i = 0; i<nr; i++){
				cr[j] -= c[base[i]]*a[i][j];
			}
		}
	}

	for(var i = 0; i<nr; i++)
		x[base[i]] = b[i];


	for(var i = 0; i<nfp; i++)
		x[i] = base.includes(i) ? x[i] : 0;

	return x;
}

function mostraIteracao(a, b, base, ba, c, cr, nr){


	var $table = $('<table class="table table-sm"></table>');

	var $thead = $('<thead></thead>');
	var $tbody = $('<tbody></tbody>');

	var $headrow = $('<tr></tr>');

	$headrow.append('<th scope="col">Base</th>');

	for(var i = 0; i<c.length; i++)
		$headrow.append('<th scope="col">`x_'+ (i+1) +'`</th>');

	$headrow.append('<th scope="col">`b`</th><th scope="col">`b/a`</th>');

	$thead.append($headrow);

	for(var i = 0; i<nr; i++){
		var $row = $('<tr></tr>');
		for(var j = 0; j<c.length + 3; j++){
			if(j == 0)
				$row.append('<th>`x_' + (base[i] + 1) + '`</th>');
			else if(j > 0 && j<c.length + 1)
				$row.append('<td>'+ Math.round(a[i][j-1]*1000)/1000 +'</td>');
			else if(j == c.length + 1)
				$row.append('<td>'+ Math.round(b[i]*1000)/1000 +'</td>');
			else if(j == c.length + 2){
				if(ba[i] == undefined)
					ba[i] = "";
				$row.append('<td>'+ Math.round(ba[i]*1000)/1000 +'</td>');
			}
		}
		$tbody.append($row);
	}

	var $row = $('<tr></tr>');
	for(var i = 0; i<cr.length + 3; i++)
		if(i > 0 && i<cr.length + 1)
			$row.append('<td>'+ Math.round(cr[i-1]*1000)/1000 +'</td>');
		else
			$row.append('<td></td>');

	$tbody.append($row);


	$table.append($thead);
	$table.append($tbody);

	$("#iteracoes").append($table);
}