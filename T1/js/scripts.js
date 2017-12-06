$(document).ready(function() {
	var a = [], b = [], c = [], cr = [], base = [], n = 2, nr = 2, nfp, maiorCusto = 0;

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
				$("#funcao").append('<input type="text" class="vals" name="f' + i + '">x<sub>' + (i+1) + '</sub> +');
			else
				$("#funcao").append('<input type="text" class="vals" name="f' + i + '">x<sub>' + (i+1) + '</sub>');
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
					$div.append('<input type="text" class="vals" name="a'+ i + j +'">x<sub>'+ (j+1) +'</sub> +');
				else
					$div.append('<input type="text" class="vals" name="a' + i + j +'">x<sub>'+ (j+1) +'</sub>');
				console.log("ue");
			}

			$div.append('<select name="s' +i+ '"><option value="le">&le;</option><option value="equal">=</option><option value="ge">&ge;</option></select>');
			$div.append('<input type="text" class="vals" name="b'+i+'">');

			$("#restricoes").append($div);
		}
	});

	$("#calcula").click(function(){
		
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
				c[nfp++] = maiorCusto*10;
			}else if(s == "ge"){
				base[i] = nfp+1;
				a[i][nfp] = -1;
				c[nfp++] = 0;
				a[i][nfp] = 1;
				c[nfp++] = maiorCusto*10;
			}
		}

		for(var i = 0; i<nr; i++){
			for(var j = 0; j<nfp; j++){
				if(a[i][j] == undefined)
					a[i][j] = 0;
			}
		}

		for(var i=0; i<c.length; i++)
			cr[i] = c[i];

		simplex(a, b, c, cr, base, n, nr, nfp);
	});


	
});