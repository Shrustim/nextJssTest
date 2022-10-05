import React from 'react'
import {useRouter} from 'next/router';
import {AppDispatch} from "../../store/store"
import { useSelector, useDispatch } from 'react-redux';
import {setLogout} from "../../store/reducers/loginSlice";
import Cookies from 'js-cookie'
import {BaseURL} from "../../../constants"
import { NextResponse } from 'next/server'

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  // 
   const loginData = useSelector((state:any) => state.login);
  const logout = async () => {
    Cookies.remove('token', {
      expires: 1
    });
   
    
    await dispatch(setLogout())
    // router.push('/logout');
    window.location.href = ""+BaseURL+"login";
  }
  return (
    <div><h2 style={{color:"white"}}>Header

{
      loginData.isLogin ?  <a href="#" style={{float:"right"}}  onClick={logout}>Logout</a> : null
    }
    </h2>
   
      
    
    </div>
  )
}

export default Header