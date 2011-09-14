/**
 * @author Bruno Carneiro
 * 
 */


/**
 * Transforma um form em um json.
 */
function form2json(form){
	var array=form.serializeArray();
	var parent={},json={}, innerObject={};
	for(var i=0; i<array.length; i++){
		if(array[i]["name"].indexOf('_')>0){
			var split=array[i]["name"].split("_");
			innerObject[split[1]]=array[i]["value"]
			json[split[0]]=innerObject;
		}
		else{
			json[array[i]["name"]]=array[i]["value"];
		}
	}
	parent[form.attr("id")]=json;
	return JSON.stringify(parent);
}