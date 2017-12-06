function simplex(a, b, c, cr, base, n, nr, nfp) {
	var jMaisNegativo, iMenorPositivo, fim = false;

	while(true){
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
			var ba = b[i]/a[i][jMaisNegativo];
			if(ba > 0 && ba < menorPositivo){
				menorPositivo = ba;
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
}
