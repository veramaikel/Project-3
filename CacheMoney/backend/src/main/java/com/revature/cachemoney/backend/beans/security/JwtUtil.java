package com.revature.cachemoney.backend.beans.security;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Properties;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

import org.springframework.stereotype.Component;

/**
 * Utility for creating and validating JSON Web Tokens (JWTs).
 * 
 * @author Ibrahima Diallo, Brian Gardner, Cody Gonsowski, and Jeffrey Lor
 */
@Component
public class JwtUtil {
    // pull our secret from properties
    private String secret;

    /**
     * ! somebody please fix this
     * Block of code that retrieves the secret from the properties file.
     */
    {
        // retrieve the properties
        Properties props = new Properties();
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        InputStream input = loader.getResourceAsStream("application.properties");

        // attempt to load the properties
        try {
            props.load(input);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        // set the local storage for the secret
        secret = props.getProperty("jwt.token.secret");
    }

    /**
     * Generate JWT for user trying to create a token.
     * 
     * @param userId associated with user trying to create token
     * @return JWT that contains verification information
     * @throws IllegalArgumentException this will throw when wrong data type is enter
     * @throws JWTCreationException this will throw when there is an issue with JWT creation
     */
    public String generateToken(Integer userId) throws IllegalArgumentException, JWTCreationException {
        return JWT.create()
                .withClaim("userId", userId)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 30))
                .sign(Algorithm.HMAC256(secret));
    }

    /**
     * Validates JWT.
     * 
     * @param token  token generated by our generateToken() method
     * @param userId userId associated with token
     * @return token verification success state (true | false)
     */
    public Boolean validateToken(String token, Integer userId) {
        try {
            // create a verifier using the same algorithm as generated token
            JWTVerifier verifier = JWT
                    .require(Algorithm.HMAC256(secret))
                    .build();

            // decrypt the random garbage based on secret key
            DecodedJWT jwt = verifier.verify(token);

            // double-check user id matches
            if (jwt.getClaim("userId").asInt() != userId) {
                return false;
            }

        } catch (JWTVerificationException e) {
            return false;
        }

        return true;
    }
}
