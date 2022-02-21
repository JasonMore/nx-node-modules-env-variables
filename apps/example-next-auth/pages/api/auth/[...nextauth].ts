import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from 'next-auth/providers/credentials';

const fakeCreds = async (username: string | undefined, password: string | undefined) => {
    return username === "foo" && password === "bar" ? {name: "John Doe"} : null
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {label: 'Username', type: 'text', placeholder: 'jsmith'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                // const res = await fetch('/your/endpoint', {
                //     method: 'POST',
                //     body: JSON.stringify(credentials),
                //     headers: { 'Content-Type': 'application/json' },
                // });
                // const user = await res.json();
                const user = await fakeCreds(credentials?.username, credentials?.password)

                return user
                // If no error and we have user data, return it
                // if (res.ok && user) {
                //     return user;
                // }
                // // Return null if user data could not be retrieved
                // return null;
            },
        }),
    ],
    theme: {
        colorScheme: "light",
    },
    callbacks: {
        async jwt({token}) {
            console.log('>>> [...nextauth].ts callbacks jwt', {token})

            token.userRole = "admin"
            return token
        },
    },
})