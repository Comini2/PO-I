function simplex(a, b, c, cr, base, n, nr, nfp) {
	var jMaisNegativo, iMenorPositivo, fim = false, ba = [], x = [];

	while(true){

		mostraIteracao(a, b, base, ba, c, cr, nr);

		var maisNegativo = 0;
		for(var i = 0; i<nfp; i++){
			if(cr[i] < maisNegativo){
				maisNegativo = cr[i];
				jMaisNegativo = i;
			}
		}
		if(maisNegativo == 0)
			break;

		var menorPositivo = Infinity;
		for(var i = 0; i<nr; i++){
			var bsa = b[i]/a[i][jMaisNegativo];
			ba[i] = bsa;
			if(bsa >= 0 && bsa < menorPositivo){
				menorPositivo = bsa;
				iMenorPositivo = i;
			}
		}
		if(menorPositivo == Infinity)
			break;

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
		$headrow.append('<th scope="col">x<sub>'+ (i+1) +'</sub></th>');

	$headrow.append('<th scope="col">b</th><th scope="col">b/a</th>');

	$thead.append($headrow);

	for(var i = 0; i<nr; i++){
		var $row = $('<tr></tr>');
		for(var j = 0; j<c.length + 3; j++){
			if(j == 0)
				$row.append('<th>x<sub>' + (base[i] + 1) + '</sub></th>');
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