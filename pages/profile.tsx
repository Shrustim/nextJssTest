import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect} from "react"
import api from "../src/restApi/index";
import { useSelector } from 'react-redux';
const apiobj = new api();
const Profile: NextPage = () => {
  const [users,setUsers] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const loginData = useSelector((state:any) => state.login);
  useEffect(()=>{
    // getUserList();
  },[])
  const getUserList= async()=>{
    setIsLoading(true);
    const response: any = await apiobj.request("users/", {}, "get");
		setUsers(response.data)
    setIsLoading(false);
  } 

// console.log("users",users)
  return (
    <div><h1>Profile</h1>
            {/* <Link href="/" >
              <a >Home</a>
            </Link><br/>
            <Link href="/login" >
              <a >Login</a>
            </Link><br/>
            <Link href="/profile" >
              <a >profile</a>
            </Link><br/>
            <Link href="/company" >
              <a >company</a>
            </Link><br/>
            <Link href="/software" >
              <a >software</a>
            </Link> */}
            <br/>
            
           <h2>Email: {loginData.isLogin ? <span>{loginData.userinfo.email}</span> : null}</h2>
           <h2>Name: {loginData.isLogin ? loginData.userinfo.firstName : null}</h2>
             <br/>
          <br/>
          {
            isLoading ? <h2>Loading</h2>
            : users.length > 0 ?
            users.map((e:any)=>{
              return(
                <h2 key={e.firstName}>{e.firstName}</h2>
              )
            })
            :null

          }
            </div>
  )
}

export default Profile
