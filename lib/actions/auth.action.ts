'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60*60*24*7;

export async function signUp (params : SignUpParams) {
    const {uid,name,email} = params;
    try{
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return{
                success:false,
                message:"User already exists,Please sign in instead",
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
        })

        return {
            success:true,
            message:"Account created successfully , sign in now"
        }

    }catch(e:any){
        console.log('Error Creating The User',e);

        if(e.code === 'auth/email-already-exists'){
            return{
                sucess:false,
                message:"This email is already registered",
            }
        }
        return {
            success:false,
            message:"Failed to create an account",
        }
    }
}

export async function signIn(params:SignInParams) {
    const {email,idToken} = params;
    try{
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return{
                success:false,
                message:"User does not exist , create an account instead"
            }
        }

        await setSessionCookie(idToken);
    }
    catch(e){
        console.log("Error From Firebase ",e);
        return {
            success:false,
            message:'Failed to login to an account'
        }
    }
}

export async function setSessionCookie(idToken:string){
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn:ONE_WEEK*1000,
    })
    cookieStore.set('session',sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        path:'/',
        sameSite:'lax'
    })
}

export async function getCurrentUser() : Promise<User | null>{
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get('session')?.value;
    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord.exists) return null;
        return {
            ...userRecord.data(),
            id:userRecord.id,

        } as User;
    }catch(e){
        console.log(e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user;
}