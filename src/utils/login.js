export function checkMobile(obj) {
	var value = document.querySelector(".moblie input").value;
	if(value != "") {
		if(!(/^1[34578]\d{9}$/.test(value))) {
			document.querySelector(".moblieFlase").click();
			document.querySelector(".moblie input").focus();
			return false;
		} else {
			document.querySelector(".verification").setAttribute("data-ver", "false");
		}
	} else {
		document.querySelector(".moblieNo").click();
	}
}
export function verification() {
	var t;
	if(document.querySelector(".verification").getAttribute("data-ver") == "false") {
		var time = parseInt(document.querySelector(".verification").innerHTML);
		t = setInterval(function() {
			time = time - 1;
			document.querySelector(".verification").innerHTML = time;
			if(time == 0) {
				clearInterval(t);
				document.querySelector(".verification").innerHTML = "获取验证码";
			}
		}, 1000);
	}
}

