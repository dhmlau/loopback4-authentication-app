# loopback4-authentication-app

This LoopBack 4 application is based on https://github.com/strongloop/loopback-next/pull/4223.

The objective of this repo is to try out what is the best way to break down the authentication tutorials: the one proposed in https://github.com/strongloop/loopback-next/pull/4223 and https://loopback.io/doc/en/lb4/Authentication-Tutorial.html.

- Basic authentication may not be an ideal method for authentication. So I'm investigating whether I can take part of the above PR as a stepping stone to add jwt authentication instead.

## Instructions

This diagram describes how JWT authentication works:
![JWT authentication](https://loopback.io/pages/en/lb4/imgs/json_web_token_overview.png)

We are going to:

- Set up the minimal infrastructure for authentication: [instructions-auth-infrastructure.md](instructions-auth-infrastructure.md). This will be pretty much the same for any kind of authentication that you're going to use.
- create a UserService that authenticates the provided credentials from the user database: [instructions-jwtauth-userservice.md](instructions-jwtauth-userservice.md)
- create a TokenService that extracts token from request header and validates & generates tokens: [instructions-jwtauth-tokenservice.md](instructions-jwtauth-tokenservice.md)
- [test the application](instructions-jwtauth-test.md)

---

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
