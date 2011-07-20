/*
 * Configuração customizada do jCompany para o FCKEditor.
 */

FCKConfig.ToolbarSets["jCompanyBasico"] = [
	['Source','-','NewPage','Preview','FitWindow'],
	['Cut','Copy','Paste','PasteText','PasteWord','insertHtmlCode','-','Print'],
	['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
	['Bold','Italic','Underline','-','Subscript','Superscript'],
	['OrderedList','UnorderedList','-','Outdent','Indent'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['Image','Flash','Table','Rule','SpecialChar','TextColor','BGColor'],
	['Style','FontFormat','FontName','FontSize','About']
];

FCKConfig.ToolbarSets["jCompanyPadrao"] = [
	['Source','-','NewPage','Preview','FitWindow'],
	['Cut','Copy','Paste','PasteText','PasteWord',,'-','Print'],
	['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
	['Bold','Italic','Underline','StrikeThrough','Subscript','Superscript'],
	['OrderedList','UnorderedList','Outdent','Indent'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['Image','Flash','Table','Rule','Smiley','SpecialChar','TextColor','BGColor'],
	['Style','FontFormat','FontName','FontSize',,'About']
];

FCKConfig.ToolbarSets["jCompanySomenteEstilo"] = [
	['Source','DocProps','-','NewPage','Preview','FitWindow','-','Templates'],
	['Cut','Copy','Paste','PasteText','PasteWord','-','Print','SpellCheck'],
	['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
	['OrderedList','UnorderedList','Outdent','Indent','Blockquote','CreateDiv'],
	'/',
	['Bold','Italic','Underline','StrikeThrough','Subscript','Superscript'],
	['Image','Flash','Table','Rule','Smiley','SpecialChar','PageBreak'],
	['Style','FontFormat','ShowBlocks','About']
];

FCKConfig.ToolbarSets["jCompanyMinimo"] = [
	['Bold','Italic','Underline','-','TextColor','BGColor'],
	['Preview','Table','FitWindow'],
	['JustifyLeft','JustifyCenter','JustifyRight','JustifyFull'],
	['Image','Flash','FontName','FontSize','About']
];

FCKConfig.ToolbarSets["jCompanySomentePreview"] = [
	['Preview','FitWindow']
];