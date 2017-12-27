var a = [], b = [], c = [], base = [], maiorCusto = 0, artificiais = [];

$(document).ready(function() {
	var n = 2, nr = 2, nfp;

	$("input").val(0);
	$("#n").val(2);
	$("#nr").val(2);

	$("#n").change(function(){
		n = parseInt($("#n").val());

		if(n < 1){
			$("#n").val(2);
			n = 2;
		}else if(n > 10){
			$("#n").val(10);
			n = 10;
		}

		$("#funcao").empty();

		$("#funcao").append("`z = `");

		for(i = 0; i<n; i++){
			if(i < n-1)
				$("#funcao").append('<input type="text" class="vals" name="f' + i + '">`x_' + (i+1) + ' +`');
			else
				$("#funcao").append('<input type="text" class="vals" name="f' + i + '">`x_' + (i+1) + '`');
		}

		$("#inteiros").empty();

		$("#inteiros").append("<h3>Variáveis inteiras: </h3>");

		for(i = 0; i<n; i++){
			$("#inteiros").append('<input type="checkbox" name="i' + i + '">`x_' + (i+1) + '`')
		}

		$("#nr").trigger("change");

	});

	$("#nr").change(function(){
		nr = parseInt($("#nr").val());

		if(nr < 1){
			$("#nr").val(2);
			nr = 2;
		}else if(nr > 10){
			$("#nr").val(10);
			nr = 10;
		}

		$("#restricoes").empty();

		$("#restricoes").append("<h3>Restrições: </h3>");

		for(var i =0; i<nr; i++){
			var $div = $("<div></div>");
			for(var j = 0; j<n; j++){
				if(j < n - 1)
					$div.append('<input type="text" class="vals" name="a'+ i + j +'">`x_'+ (j+1) +' +`');
				else
					$div.append('<input type="text" class="vals" name="a' + i + j +'">`x_'+ (j+1) +'`');
			}

			$div.append('<select name="s' +i+ '"><option value="le">&le;</option><option value="equal">=</option><option value="ge">&ge;</option></select>');
			$div.append('<input type="text" class="vals" name="b'+i+'">');

			$("#restricoes").append($div);
		}

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	});

	$("#calcula").click(function(){
		
		var artIndex = 0, inteiros = [];

		$("#iteracoes").empty();
		$("#problema").empty();
		$("#solucao").empty();

		nfp = n;
		nr = parseInt($("#nr").val());

		for(var i = 0; i<n; i++)
			if($('input[name="i'+ i + '"]').is(':checked'))
				inteiros.push(i);

		if(inteiros.length == 0)
			return;

		var fp = $("#tipo").val() == "min" ? 1 : -1;

		for(var i = 0; i<n; i++){
			c[i] = parseFloat($("input[name=f"+i+"]").val())*fp;
			if(Math.abs(c[i]) > maiorCusto)
				maiorCusto = Math.abs(c[i]);
		}

		for(var i = 0; i<nr; i++){
			a[i] = [];
			b[i] = parseFloat($("input[name=b"+i+"]").val());

			for(var j = 0; j<n; j++)
				a[i][j] = parseFloat($("input[name=a"+i+j+"]").val());

			var s = $("select[name=s"+i+"]").val();
			if(s == "le"){
				base[i] = nfp;
				a[i][nfp] = 1;
				c[nfp++] = 0;
			}else if(s == "equal"){
				base[i] = nfp;
				a[i][nfp] = 1;
				artificais[artIndex++] = nfp;
				c[nfp++] = maiorCusto*10;
			}else if(s == "ge"){
				base[i] = nfp+1;
				a[i][nfp] = -1;
				c[nfp++] = 0;
				a[i][nfp] = 1;
				artificais[artIndex++] = nfp;
				c[nfp++] = maiorCusto*10;
			}
		}

		for(var i = 0; i<nr; i++){
			for(var j = 0; j<nfp; j++){
				if(a[i][j] == undefined)
					a[i][j] = 0;
			}
		}

		var funString = "`";

		funString += $("#tipo").val() == "min" ? "min z=" : "min -z= ";

		for(var i = 0; i<nfp; i++){
			if(i < nfp-1)
				funString += c[i] + "x_" + (i+1) +" + ";
			else
				funString += c[i] + "x_" + (i+1) +"`<br>";
		}

		$("#problema").append(funString);
		$("#problema").append("&nbsp;&nbsp;`s.a:` ");



		for(var i=0; i<nr; i++){
			funString = i == 0 ? "`" : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`";

			for(var j = 0; j<nfp; j++){
				if(j < nfp-1)
					funString += a[i][j] + "x_" + (j+1) + " + ";
				else
					funString += a[i][j] + "x_" + (j+1) + " = " + b[i] + "`<br>";
			}
			$("#problema").append(funString);
		}

		$("#problema").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`x >= 0`<br>");

		$("#hint-solucao").show();

		var aO = JSON.parse(JSON.stringify(a));
		var bO = JSON.parse(JSON.stringify(b));
		var cO = JSON.parse(JSON.stringify(c));
		var baseO = JSON.parse(JSON.stringify(base));
		var artificiaisO = JSON.parse(JSON.stringify(artificiais));

		var x = bifurcacao(aO, bO, cO, baseO,artificiaisO, inteiros, maiorCusto);

		if(x != null){
			$("#solucao").append("<h3 class='text-center'>Solução ótima: </h3>");
			for(var i = 0; i<n; i++){
				$("#solucao").append("<h4 class='text-center'>`x_" + (i+1) + " = " + x[i] + "`</h4>");
			}
			$("#solucao").append("<h3 class='text-center'>Folgas: </h3>");
			for(var i = n; i<nfp; i++){
				if(!artificais.includes(i))
					$("#solucao").append("<h4 class='text-center'>`r_" + (i+1-n) + " = " + x[i] + "`</h4>");
			}
		}
		else
			$("#solucao").append("<h3>Solução vazia.</h3>");

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

		console.log(x);
	});


	
});

function bifurcacao(al, bl, cl, basel, artificiaisl, inteiros, maiorCusto){

	var x = simplex(al, bl, cl, basel, artificiaisl), nInt = -1;

	if((nInt = naoInteiros(x, inteiros)) > -1){

		var acima, abaixo, s1 = [], s2 = [], x1, x2;

		abaixo = Math.floor(x[nInt]);
		acima = Math.ceil(x[nInt]);

		//Cópias para impedir problemas de memória com vetores.

		var a1 = copy(a);
		var b1 = copy(b);
		var c1 = copy(c);
		var base1 = copy(base);
		var artificiais1 = copy(artificiais);

		var a2 = copy(a);
		var b2 = copy(b);
		var c2 = copy(c);
		var base2 = copy(base);
		var artificiais2 = copy(artificiais);

		for(var i = 0, n = a1[0].length; i < n; i++)
			s1[i] = nInt == i ? 1 : 0;

		s1.push(1);
		b1.push(abaixo); 
		c1.push(0);
		base1.push(s1.length-1);

		for(var i = 0; i<a1.length; i++)
			for(var j = 0; j < 1; j++)
				a1[i].push(0);

		a1.push(s1);


		for(var i = 0, n = a2[0].length; i < n; i++)
			s2[i] = nInt == i ? 1 : 0;

		s2.push(1);
		s2.push(-1);
		b2.push(acima); 
		c2.push(0);
		c2.push(maiorCusto*10);
		base2.push(s1.length-1);
		artificiais2.push(s1.length-1);

		for(var i = 0; i<a2.length; i++)
			for(var j = 0; j < 2; j++)
				a2[i].push(0);

		a2.push(s2);

		x1 = bifurcacao(a1, b1, c1, base1, artificiais1, inteiros, maiorCusto);
		x2 = bifurcacao(a2, b2, c2, base2, artificiais2, inteiros, maiorCusto);

		x = x1 == null ? x2 : x1;

	}

	return x;
}

function copy(item){
	if(item == null || item == undefined)
		return;

	var a = [];

	for(var i = 0; i<item.length; i++){
		if(Array.isArray(item[i])){
			a[i] = [];
			for(var j = 0; j < item[i].length; j++){
				a[i][j] = item[i][j];
			}
		}else{
			a[i] = item[i];
		}
	}

	return a;
}