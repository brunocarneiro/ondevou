function getDialogTemplate(){

	return "<div class='leftColWrapper' title='Lugares do FourSquare'><form id='form'><table id='fsPlaces'>{{#lugares}}<tr><td><input type='checkbox' name='checked' value='off' /><input name='fsId' style='visibility:hidden' value='{{fourSquareId}}'></td><td>{{nome}}<td></tr>{{/lugares}}<a id='importar' >Importar</a></table></form></div>";
}