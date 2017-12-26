$(document).ready(function() {
	var a = [], b = [], c = [], cr = [], base = [], n = 2, nr = 2, nfp, maiorCusto = 0, artificais = [];

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

		$("#funcao").append("z = ");

		for(i = 0; i<n; i++){
			if(i < n-1)
				$("#funcao").append('<input type="text" class="vals" name="f' + i + '">.x<sub>' + (i+1) + '</sub> +');
			else
				$("#funcao").append('<input type="text" class="vals" name="f' + i + '">.x<sub>' + (i+1) + '</sub>');
		}
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

		$("#restricoes").append("<label>Restrições: </label>");

		for(var i =0; i<nr; i++){
			var $div = $("<div></div>");
			for(var j = 0; j<n; j++){
				if(j < n - 1)
					$div.append('<input type="text" class="vals" name="a'+ i + j +'">.x<sub>'+ (j+1) +'</sub> + ');
				else
					$div.append('<input type="text" class="vals" name="a' + i + j +'">.x<sub>'+ (j+1) +'</sub> ');
			}

			$div.append(' <select name="s' +i+ '"><option value="le">&le;</option><option value="equal">=</option><option value="ge">&ge;</option></select> ');
			$div.append(' <input type="text" class="vals" name="b'+i+'">');

			$("#restricoes").append($div);
		}
	});

	$("#calcula").click(function(){
		
		$("#iteracoes").empty();
		$("#problema").empty();
		$("#solucao").empty();

		nfp = n;
		nr = parseInt($("#nr").val());

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
				artificais.push(nfp);
				c[nfp++] = maiorCusto*10;
			}else if(s == "ge"){
				base[i] = nfp+1;
				a[i][nfp] = -1;
				c[nfp++] = 0;
				a[i][nfp] = 1;
				artificais.push(nfp);
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

		var x = simplexDuasFases(a, b, c, base, artificais);

		$("#iteracoes").append('<h3 class="text-center">Fim da segunda fase.</h3>');


		if(x != null){
			$("#solucao").append("<h3 class='text-center'>Solução ótima: </h3>");
			for(var i = 0; i< n; i++){
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

	});


	
});