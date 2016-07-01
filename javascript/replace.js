function replaceChars(f) {
	var orig = f.value;
	
	f.value = f.value.replace(/\$/gi, "∃");    // Existential quantifier
	f.value = f.value.replace(/\$/gi, "∃");    // Existential quantifier
	f.value = f.value.replace(/v/g, "∨");     // Logical OR
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
function getCaretPosition (oTextarea) {
	var docObj = oTextarea.ownerDocument;
	var result = {start:0, end:0, caret:0};
	
	if (navigator.appVersion.indexOf("MSIE")!=-1) {
		if (oTextarea.tagName.toLowerCase() == "textarea") {
			if (oTextarea.value.charCodeAt(oTextarea.value.length-1) < 14) {
				oTextarea.value=oTextarea.value.replace(/34/g,'')+String.fromCharCode(28);
			}
			var oRng = docObj.selection.createRange();
			var oRng2 = oRng.duplicate();
			oRng2.moveToElementText(oTextarea);
			oRng2.setEndPoint('StartToEnd', oRng);
			result.end = oTextarea.value.length-oRng2.text.length;
			oRng2.setEndPoint('StartToStart', oRng);
			result.start = oTextarea.value.length-oRng2.text.length; 
			result.caret = result.end;
			if (oTextarea.value.substr(oTextarea.value.length-1) == String.fromCharCode(28)) {
				oTextarea.value = oTextarea.value.substr(0, oTextarea.value.length-1);
			}			
		} else {
			var range = docObj.selection.createRange();
			var r2 = range.duplicate();			
			result.start = 0 - r2.moveStart('character', -100000);
			result.end = result.start + range.text.length;	
			result.caret = result.end;
		}			
	} else {
		result.start = oTextarea.selectionStart;
    	result.end = oTextarea.selectionEnd;
		result.caret = result.end;
	}
	if (result.start < 0) {
		 result = {start:0, end:0, caret:0};
	}	
	return result.caret;
}

function setCaretPosition(ctrl, pos) {
	if(ctrl.setSelectionRange) {
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos - ctrl.value.substring(0, pos).split('\n').length + 1 );
		range.moveStart('character', pos - ctrl.value.substring(0, pos).split('\n').length + 1);
		range.select();
	}
}

var orig = "";
function process(ctrl) {
	if (orig != ctrl.value) {
		var pos = getCaretPosition(ctrl);
		var l = ctrl.value.length;
		replaceChars(ctrl);
		orig = ctrl.value;
		l = l - ctrl.value.length;
		pos = Math.max(pos-l,0);
		setCaretPosition(ctrl,pos);
	}
}

