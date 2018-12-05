function gomory(a, b, c, base, artificiais, inteiros, maiorCusto){

	var x = simplex(a, b, c, base, artificiais), naoInteiro = -1, linha = 0, it = 0;

	while((naoInteiro = naoInteiros(x, inteiros)) >= 0 && it < 15){
		var s = [];

		for(var i = 0; i < base.length; i++)
			if(base[i] == naoInteiro)
				linha = i;

		for(var j = 0, n = a[linha].length; j < n; j++)
			s[j] = a[linha][j] - Math.floor(a[linha][j]);

		s.push(-1);
		s.push(1);

		base.push(s.length-1);
		artificiais.push(s.length-1);

		for(var i = 0; i<a.length; i++)
			for(var j = 0; j <2; j++)
				a[i].push(0);


		a.push(s);

		b.push(b[linha] - Math.floor(b[linha]));

		c.push(0);
		c.push(maiorCusto*10);

		x = simplex(a, b, c, base, artificiais);

		it++;
	}

	return x;

}

function simplex(a, b, c, base, artificiais) {
	var jMaisNegativo = 0, iMenorPositivo = 0, fim = false, ba = [], x = [], cr = [], nr, nfp, it = 0;

	nr = a.length;
	nfp = a[0].length;

	while(it < 15){

		for(var j = 0; j<nfp; j++){
			cr[j] = c[j];
			for(var i = 0; i<nr; i++){
				cr[j] -= c[base[i]]*a[i][j];
			}
		}

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

		mostraIteracao(a, b, base, ba, c, cr, iMenorPositivo, jMaisNegativo);

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
		it++;
	}

	for(var i = 0; i<nr; i++)
		x[base[i]] = b[i];


	for(var i = 0; i<nfp; i++)
		x[i] = base.includes(i) ? x[i] : 0;

	return x;
}

function mostraIteracao(a, b, base, ba, c, cr, pivoi, pivoj){

	var nr = a.length;


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
			else if(j > 0 && j<c.length + 1){
				if(i == pivoi && j-1 == pivoj)
					$row.append('<td class="pivo">'+ Math.round(a[i][j-1]*1000)/1000 +'</td>');
				else
					$row.append('<td>'+ Math.round(a[i][j-1]*1000)/1000 +'</td>');
			}
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

function naoInteiros(x, inteiros){

	console.log(x);
	for(var i = x.length - 1; i >= 0; i--){
		if(inteiros.includes(i)){
			if(x[i] - Math.floor(x[i]) > 1e-7){
				return i;
			}
		}
	}
	return -1;
}