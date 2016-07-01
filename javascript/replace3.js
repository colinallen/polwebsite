function replaceChars_rev(f) {
	f.value = f.value.replace(/∃/gi, "$");    // Existential quantifier
	f.value = f.value.replace(/∨/gi, "v");     // Logical OR
	f.value = f.value.replace(/([^\d])∙/gi, "$1.");     // Logical AND
	f.value = f.value.replace(/∴/gi, ":."); // Therefore
	f.value = f.value.replace(/↔/gi, "<>"); // Biconditional
	f.value = f.value.replace(/→/gi, "->"); // conditional
	return true;
	
}
