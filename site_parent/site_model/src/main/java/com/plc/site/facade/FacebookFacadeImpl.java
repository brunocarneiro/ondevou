/*  																													
	    			       Jaguar-jCompany Developer Suite.																		
			    		        Powerlogic 2010-2014.
			    		    
		Please read licensing information in your installation directory.Contact Powerlogic for more 
		information or contribute with this project: suporte@powerlogic.com.br - www.powerlogic.com.br																								
 */ 
package com.plc.site.facade;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.powerlogic.jcompany.commons.config.stereotypes.SPlcFacade;
import com.restfb.BinaryAttachment;
import com.restfb.Connection;
import com.restfb.DefaultJsonMapper;
import com.restfb.Facebook;
import com.restfb.FacebookClient;
import com.restfb.JsonMapper;
import com.restfb.Parameter;
import com.restfb.batch.BatchRequest;
import com.restfb.batch.BatchRequest.BatchRequestBuilder;
import com.restfb.batch.BatchResponse;
import com.restfb.json.JsonObject;
import com.restfb.types.FacebookType;
import com.restfb.types.Insight;
import com.restfb.types.Page;
import com.restfb.types.Post;
import com.restfb.types.Url;
import com.restfb.types.User;

@SPlcFacade
public class FacebookFacadeImpl implements IFacebookFacade {

	//@Override
	//@PlcTransactional


	public void includingBinaryAttachment(FacebookClient facebookClient) {
		// Per the FB Batch API documentation, attached_files is a comma-separated list
		// of attachment names to include in the API call.
		// RestFB will use the filename provided to your BinaryAttachment minus the file
		// extension as the name of the attachment.
		// For example, "cat-pic.png" must be referenced here as "cat-pic". 

		List<BatchRequest> batchRequests = Arrays.asList(
		  new BatchRequestBuilder("me/photos").attachedFiles("cat-pic").build(),
		  new BatchRequestBuilder("me/videos")
		    .attachedFiles("cat-vid, cat-vid-2")
		    .body(Parameter.with("message", "This cat is hilarious"))
		    .build());

		// Define the list of attachments to include in the batch.

		List<BinaryAttachment> binaryAttachments = Arrays.asList(
		  BinaryAttachment.with("cat-pic.png", getClass().getResourceAsStream("/cat-pic.png")),
		  BinaryAttachment.with("cat-vid.mov", getClass().getResourceAsStream("/cat-vid.mov")),
		  BinaryAttachment.with("cat-vid-2.mov", getClass().getResourceAsStream("/cat-vid-2.mov")));

		// Finally, execute the batch.

		facebookClient.executeBatch(batchRequests, binaryAttachments);
	}

	public void batchRequest(FacebookClient facebookClient, PrintWriter out) {
		
		BatchRequest meRequest = new BatchRequestBuilder("me").build();
		
		BatchRequest badRequest = new BatchRequestBuilder("this-is-a-bad-request/xxx").build();
		
		BatchRequest m83musicRequest = new BatchRequestBuilder("m83music/feed").parameters(Parameter.with("limit", 5)).build();
		
		BatchRequest postRequest = new BatchRequestBuilder("me/feed").method("POST").body(Parameter.with("message", "Testing!")).build();

		// ...and execute the batch.

		List<BatchResponse> batchResponses = facebookClient.executeBatch(meRequest, badRequest, m83musicRequest, postRequest);

		// Responses are ordered to match up with their corresponding requests.

		BatchResponse meResponse = batchResponses.get(0);
		BatchResponse badResponse = batchResponses.get(1);
		BatchResponse m83musicResponse = batchResponses.get(2);
		BatchResponse postResponse = batchResponses.get(3);

		// Since batches can have heterogenous response types, it's up to you
		// to parse the JSON into Java objects yourself. Luckily RestFB has some built-in
		// support to help you with this.

		JsonMapper jsonMapper = new DefaultJsonMapper();

		// Here we marshal to the built-in User type.

		User me = jsonMapper.toJavaObject(meResponse.getBody(), User.class);
		out.println(me);
		out.println("<br/>");

		// To detect errors, check the HTTP response code.

		if(badResponse.getCode() != 200)
		  out.println("Batch request failed: " + badResponse);

		out.println("<br/>");
		// You can pull out connection data...

		List<Post> m83music = jsonMapper.toJavaList(m83musicResponse.getBody(), Post.class);
		out.println("M83's Feed: " + m83music);
		
		out.println("<br/>");

		// ...or do whatever you'd like with the raw JSON.

		out.println(postResponse.getBody());
		
		out.println("<br/>");
	}

	public void deleteObject(FacebookClient facebookClient, PrintWriter out) {
		Boolean deleted = facebookClient.deleteObject("some object ID");
		out.println("Deleted object? " + deleted);
		out.println("<br/>");
	}

	public void publishingCheckIn(FacebookClient facebookClient, PrintWriter out) {
		
		Map<String, String> coordinates = new HashMap<String, String>();
		coordinates.put("latitude", "37.06");
		coordinates.put("longitude", "-95.67");
		                        
		FacebookType publishCheckinResponse = facebookClient.publish(
				"me/checkins",
				FacebookType.class,
				Parameter.with("message", "I'm here!"),
				Parameter.with("coordinates", coordinates), 
				Parameter.with("place", 1234));

		out.println("Published checkin ID: " + publishCheckinResponse.getId());
		out.println("<br/>");
	}

	public void publishingImage(FacebookClient facebookClient, PrintWriter out) {
		// Publishing an image to a photo album is easy!
		// Just specify the image you'd like to upload and RestFB will handle it from there.

		FacebookType publishPhotoResponse = facebookClient.publish("me/photos", FacebookType.class,
		  BinaryAttachment.with("cat.png", getClass().getResourceAsStream("/cat.png")),
		  Parameter.with("message", "Test cat"));

		out.println("Published photo ID: " + publishPhotoResponse.getId());
		out.println("<br/>");

		// Publishing a video works the same way.

		facebookClient.publish("me/videos", FacebookType.class,
		  BinaryAttachment.with("cat.mov", getClass().getResourceAsStream("/cat.mov")),
		  Parameter.with("message", "Test cat"));
	}

	public void publishingSimpleMessage(FacebookClient facebookClient, PrintWriter out) {
		// Publishing a simple message.
		// FacebookType represents any Facebook Graph Object that has an ID property.

		FacebookType publishMessageResponse =
		  facebookClient.publish("me/feed", FacebookType.class,
		    Parameter.with("message", "RestFB test"));

		out.println("Published message ID: " + publishMessageResponse.getId());
		out.println("<br/>");

		// Publishing an event

		Long tomorrow = System.currentTimeMillis() / 1000L + 60L * 60L * 24L;
		Long twoDaysFromNow = System.currentTimeMillis() / 1000L + 60L * 60L * 48L;

		FacebookType publishEventResponse = facebookClient.publish("me/events", FacebookType.class,
		  Parameter.with("name", "Party"), Parameter.with("start_time", tomorrow),
		    Parameter.with("end_time", twoDaysFromNow));

		out.println("Published event ID: " + publishEventResponse.getId());
		out.println("<br/>");
	}

	public void dataAsJSONObject(FacebookClient facebookClient, PrintWriter out) {
		// Sometimes you can't know field names at compile time
		// so the @Facebook annotation can't be used.
		// Or maybe you'd like full control over the data that gets returned.
		// Either way, RestFB has you covered.  Just map any API call to JsonObject.

		// Here's how to fetch a single object

		JsonObject btaylor = facebookClient.fetchObject("btaylor", JsonObject.class);
		out.println(btaylor.getString("name"));
		out.println("<br/>");

		// Here's how to fetch a connection

		JsonObject photosConnection = facebookClient.fetchObject("me/photos", JsonObject.class);
		String firstPhotoUrl = photosConnection.getJsonArray("data").getJsonObject(0).getString("source");
		out.println(firstPhotoUrl);
		out.println("<br/>");

		// Here's how to handle an FQL query

		String query = "SELECT uid, name FROM user WHERE uid=220439 or uid=7901103";
		List<JsonObject> queryResults = facebookClient.executeQuery(query, JsonObject.class);
		out.println(queryResults.get(0).getString("name"));
		out.println("<br/>");
		
		// Sometimes it's helpful to use JsonMapper directly if you're working with JsonObjects.

		List<String> ids = new ArrayList<String>();
		ids.add("btaylor");
		ids.add("http://www.imdb.com/title/tt0117500/");

		// First, make the API call...

		JsonObject results = facebookClient.fetchObjects(ids, JsonObject.class);

		// ...then pull out raw JSON data and map each type "by hand".
		// Normally your FacebookClient uses a JsonMapper internally, but
		// there's nothing stopping you from using it too!

		JsonMapper jsonMapper = new DefaultJsonMapper();
		User user = jsonMapper.toJavaObject(results.getString("btaylor"), User.class);
		Url url = jsonMapper.toJavaObject(results.getString("http://restfb.com"), Url.class);

		out.println("User is " + user);
		out.println("<br/>");
		out.println("URL is " + url);
		out.println("<br/>");
	}

	public void selectingSpecificFields(FacebookClient facebookClient, PrintWriter out) {
		User user = facebookClient.fetchObject("me", User.class, Parameter.with("fields", "id, name"));

		out.println("User name: " + user.getName());
		out.println("<br/>");
	}

	public void passingParameters(FacebookClient facebookClient,
			PrintWriter out) {
		// You can pass along any parameters you'd like to the Facebook endpoint.

		Date oneWeekAgo = new Date(System.currentTimeMillis() / 1000L - 60L * 60L * 24L * 7L);

		Connection<Post> filteredFeed = facebookClient.fetchConnection("me/feed", Post.class, Parameter.with("limit", 3), Parameter.with("until", "yesterday"), Parameter.with("since", oneWeekAgo));

		out.println("Filtered feed count: " + filteredFeed.getData().size());
		out.println("<br/>");
	}

	public void metadataManyCalls(FacebookClient facebookClient, PrintWriter out) {
		// You can specify metadata=1 for many calls, not just this one.
		// See the Facebook Graph API documentation for more details. 

		User userWithMetadata = facebookClient.fetchObject("me", User.class, Parameter.with("metadata", 1));

		out.println("User metadata: has albums? " + userWithMetadata.getMetadata().getConnections().hasAlbums());
		out.println("<br/>");
	}

	public void executeFQLQueries(FacebookClient facebookClient, PrintWriter out) {
		//FQL
		String query = "SELECT uid, name FROM user WHERE uid=220439 or uid=7901103";
		
		List<FqlUser> users = facebookClient.executeQuery(query, FqlUser.class);

		out.println("Users: " + users);
		out.println("<br/>");
		
		//MULTIPLAS FQL
		
		Map<String, String> queries = new HashMap<String, String>();
		queries.put("users", "SELECT uid, name FROM user WHERE uid=220439 OR uid=7901103");
		queries.put("likers", "SELECT user_id FROM like WHERE object_id=122788341354");

		MultiqueryResults multiqueryResults = facebookClient.executeMultiquery(queries, MultiqueryResults.class);

		out.println("Users: " + multiqueryResults.users);
		out.println("<br/>");
		out.println("People who liked: " + multiqueryResults.likers);
		out.println("<br/>");
	}

	public void fetchInsights(FacebookClient facebookClient, PrintWriter out) {
		// Fetching Insights data is as simple as fetching a Connection

		Connection<Insight> insights = facebookClient.fetchConnection("PAGE_ID/insights", Insight.class);

		for (Insight insight : insights.getData()) {
			out.println(insight.getName());
			out.println("<br/>");
		}
	}

	public void searching(FacebookClient facebookClient, PrintWriter out) {
		// Searching is just a special case of fetching Connections -
		// all you have to do is pass along a few extra parameters.

		Connection<Post> publicSearch = facebookClient.fetchConnection("search", Post.class, Parameter.with("q", "watermelon"), Parameter.with("type", "post"));

		Connection<User> targetedSearch = facebookClient.fetchConnection("me/home", User.class, Parameter.with("q", "Mark"), Parameter.with("type", "user"));

		out.println("Public search: " + publicSearch.getData().get(0).getMessage());
		out.println("<br/>");
		
		out.println("Posts on my wall by friends named Mark: " + targetedSearch.getData().size());
		out.println("<br/>");
	}

	public void fetchConnections(FacebookClient facebookClient, PrintWriter out) {
		Connection<User> myFriends = facebookClient.fetchConnection("me/friends", User.class);
		Connection<Post> myFeed = facebookClient.fetchConnection("me/feed", Post.class);

		out.println("Count of my friends: " + myFriends.getData().size());
		out.println("<br/>");
		
		if(myFeed.getData().size() > 0) {
			out.println("First item in my feed: " + myFeed.getData().get(0));
			out.println("<br/>");
		}

		// Connections support paging

		if(myFeed.hasNext()) {
		  Connection<Post> myFeedPage2 = facebookClient.fetchConnectionPage(myFeed.getNextPageUrl(), Post.class);		  
		}
	}

	public void fetchMultipleObjet(FacebookClient facebookClient, PrintWriter out) {
		// Fetching Multiple Objects in One Call
		FetchObjectsResults fetchObjectsResults = facebookClient.fetchObjects(Arrays.asList("me", "cocacola"), FetchObjectsResults.class);

		out.println("User name: " + fetchObjectsResults.me.getName());
		out.println("<br/>");
		out.println("Page likes: " + fetchObjectsResults.page.getLikes());
		out.println("<br/>");
	}

	public void fetchSingleObject(FacebookClient facebookClient, PrintWriter out) {
		// Fetching Single Objects
		User user = facebookClient.fetchObject("me", User.class);
		Page page = facebookClient.fetchObject("cocacola", Page.class);

		out.println("User name: " + user.getName());
		out.println("<br/>");
		out.println("Page likes: " + page.getLikes());
		out.println("<br/>");
	}	
}



class FetchObjectsResults {

	@Facebook
	User me;

	// If the Facebook property name doesn't match
	// the Java field name, specify the Facebook field name in the annotation.
	@Facebook("cocacola")
	Page page;
}

class FqlUser {
	@Facebook
	String uid;

	@Facebook
	String name;

	@Override
	public String toString() {
		return String.format("%s (%s)", name, uid);
	}
}

class FqlLiker {
	@Facebook("user_id")
	String userId;

	@Override
	public String toString() {
		return userId;
	}
}

class MultiqueryResults {
	@Facebook
	List<FqlUser> users;

	@Facebook
	List<FqlLiker> likers;
}