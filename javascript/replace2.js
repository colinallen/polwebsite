function replaceChars(f) {
	var orig = f.value;
	
	f.value = f.value.replace(/\$/gi, "∃");    // Existential quantifier
	f.value = f.value.replace(/\$/gi, "∃");    // Existential quantifier
	f.value = f.value.replace(/v/gi, "∨");     // Logical OR
	f.value = f.value.replace(/([\d])∙/gi, "$1.");     // Logical AND
	f.value = f.value.replace(/([^\d])\./gi, "$1∙");     // Logical AND
	f.value = f.value.replace(/:\.|\.:|∙:|:∙/gi, "∴"); // Therefore
	f.value = f.value.replace(/<|<>|↔>|<->|↔->/gi, "↔"); // Biconditional
	f.value = f.value.replace(/->|>/gi, "→"); // conditional
	return orig != f.value;
}

function replaceCharsRev(f) {
	f.value = f.value.replace(/∃/gi, "$");    // Existential quantifier
	f.value = f.value.replace(/∨/gi, "v");     // Logical OR
	f.value = f.value.replace(/([^\d])∙/gi, "$1.");     // Logical AND
	f.value = f.value.replace(/∴/gi, ":."); // Therefore
	f.value = f.value.replace(/↔/gi, "<->"); // Biconditional
	f.value = f.value.replace(/→/gi, "->"); // conditional
	return true;
}

function getCaretPosition (ctrl) {
	var CaretPos = 0;
	// IE Support
	/*if (document.selection) {
		alert("IE");
		ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}*/
	// Firefox support
	//else
	if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
											return (CaretPos);
}

function setCaretPosition(ctrl, pos) {
	alert(pos);
	if(ctrl.setSelectionRange) {
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.move('character', pos + ctrl.value.substring(pos).split('\n').length - 1 );
		range.select();
	}
}

var orig = "";
function process(ctrl) {
	if (orig != ctrl.value) {
		var pos = getCaretPosition(ctrl);
		alert("Get: "+pos);
		var l = ctrl.value.length;
		replaceChars(ctrl);
		orig = ctrl.value;
		l = l - ctrl.value.length;
		pos = Math.max(pos-l,0);
		setCaretPosition(ctrl,pos);
	}
}

