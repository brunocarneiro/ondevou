package com.griggy.rest;

import java.io.*;
import java.net.Authenticator;
import java.net.URL;

/**
 * FourSquareDemo
 * User: Michael
 * Date: 10/19/10
 * Time: 7:53 PM
 */
public class Teste
{
    private static final int DEFAULT_CAPACITY = 4096;
    private static final String DEFAULT_URL = "http://api.foursquare.com/v1/";
    private static final String DEFAULT_EMAIL = "bj.carneiro@gmail.com";
    private static final String DEFAULT_PASSWORD = "senha04";

    public static void main(String[] args)
    {
        long startTime = System.currentTimeMillis();
        long endTime = 0L;
        try
        {
            String downloadSite = ((args.length > 0) ? args[0] : DEFAULT_URL);
            URL url = new URL(downloadSite + "history");
           // Authenticator.setDefault(new BasicAuthenticator(DEFAULT_EMAIL, DEFAULT_PASSWORD));
            String contents = readFromUrl(url);

            PrintStream ps = ((args.length > 1) ? new PrintStream(new FileOutputStream(new File(args[1]))) : System.out);
            printToStream(ps, contents);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            endTime = System.currentTimeMillis();
            System.out.println("wall time: " + (endTime - startTime) + " ms");
        }
    }

    private static void printToStream(PrintStream ps, String contents) throws IOException
    {
        ps.println(contents.toString());
        ps.close();
    }

    private static String readFromUrl(URL url) throws IOException
    {
        StringBuilder contents = new StringBuilder(DEFAULT_CAPACITY);

        BufferedReader br = null;

        try
        {
            InputStream is = url.openConnection().getInputStream();

            br = new BufferedReader(new InputStreamReader(is));
            String line;
            String newline = System.getProperty("line.separator");
            while ((line = br.readLine()) != null)
            {
                contents.append(line).append(newline);
            }
        }
        finally
        {
            try
            {
                if (br != null)
                {
                    br.close();
                }
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }

        return contents.toString();
    }
}
