import { NextResponse } from 'next/server'
import type { NextRequest,NextFetchEvent } from 'next/server'
import * as jose from 'jose'
import {JWTSecret} from "./constants"
import jwt_decode from "jwt-decode";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // console.log("called middlware ---")
  // console.log("url",request.nextUrl.pathname)
  const token: any = request.cookies.get('token')
  // console.log("middleware - token" , token);
  if(token !== undefined && token != ""){
  //   //user is logged in
  //   //verify jwt token is valid or not

  
        try {
          const {payload} = await jose.jwtVerify(token, new TextEncoder().encode(JWTSecret));
          // console.log("payload",payload)
          if (request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
          }else{
            var token_data:any = jwt_decode(token);
            if(token_data.role === "admin"){
              // console.log("user is admin");
              return NextResponse.next();
            }else{
              // console.log("user is regular user");
              // console.log("---"+request.nextUrl.pathname+"----")
              if(request.nextUrl.pathname.includes("admin")){
                return NextResponse.redirect(new URL('/dashboard', request.url))
              }
            }
          
          }
          // return NextResponse.next();
        } catch(err) {
            // err
            if (!request.nextUrl.pathname.startsWith('/login')) {
              return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    }
   
  else{
  //   //user is not logged in 
  if (!request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  }

 
    //  console.log("middleware File",request.nextUrl)
    
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: '/profile',
   matcher: [
    '/profile',
    '/dashboard',
    '/login',
    '/company',
    '/company/:path*',
    '/software',
    '/software/:path*',
    '/admin/:path*'
  ],
}