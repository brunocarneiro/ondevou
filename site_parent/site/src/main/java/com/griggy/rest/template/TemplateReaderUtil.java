package com.griggy.rest.template;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONObject;

import com.powerlogic.jcompany.commons.config.qualifiers.QPlcDefault;

/**
 * 
 * @author Bruno Carneiro
 *
 */
public class TemplateReaderUtil {

	
	@Produces
	@ApplicationScoped
	@QTemplateMap
	public Map<String,Map> buildTemplateMap(@QPlcDefault HttpServletRequest request){
		return readAllFiles(new File(request.getRealPath("template")), null);
	}
	
	public Map<String, Map> readAllFiles(File dir,Map<String, Map> map){
		
		if(map==null)
			map=new HashMap<String,Map>();
		if(dir==null)
			dir = new File("template");
		
		for(File file:dir.listFiles()){
			if(file.isDirectory()){
				readAllFiles(file,map);
				continue;
			}
			else{
				map.put(file.getName().split("\\.")[0], readFile(file));
			}
			
		}
		return map;
	}

	private Map readFile(File file) {
		
		try {
			BufferedReader reader = new BufferedReader(new FileReader(file));
			String line ="", temp="";
			while(temp!=null){
				line+=temp;
				temp=reader.readLine();
			}
			line=line.replaceAll("\t", "");
			line=line.replace("\\", "");
			return JSONObject.fromObject(line);
		} catch (IOException e) {
			
			e.printStackTrace();
			return null;
		}
		
		
	}
}
