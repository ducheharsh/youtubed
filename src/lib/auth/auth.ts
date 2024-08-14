import CredentialsProvider  from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export const NEXT_AUTH ={
    providers: [
        CredentialsProvider({
            name:'email',
            credentials:{
                email:{label:'Username', type:"text", placeholder:"email"},
            },
            async authorize(credentials:any){
                return{
                    id:"1",
                    name:"test",
                    email:"test@test.com"
                };
            },
        }),
        GoogleProvider({
            clientId:process.env.GOOGLE_ID || " ",
            clientSecret:process.env.GOOGLE_SECRET || " ",
            authorization:{
                params:{
                    scope:["https://www.googleapis.com/auth/userinfo.profile",
                        "https://www.googleapis.com/auth/youtube.readonly",
                    "email" ].join(" "),

                }
            }
        },
        
    )
    ],
    session:{
        jwt:true,
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async signIn({profile}:any){
            try{
                const user = await prisma.user.findUnique({
                    where:{
                        email:profile.email
                    }
                })
            if(!user){
                const newUser = await prisma.user.create({
                    data:{
                        id:profile.sub,
                        email:profile.email,
                        name:profile.name,
                        playlists:{},
                    }
                })
            
                return true 
            }
            return true
            
            }catch(err){
            console.log("Error while logging in",err)
            return false
            }
        },
        async jwt({token, account }:any) {
            if (account?.access_token) {
              token.access_token = account.access_token;
            }
            return token;
        },
        async session ({session, token, user}:any) {
            session.accessToken = token.access_token;
            session.id = token.sub
       
            return session;
        }

    } 
    
}