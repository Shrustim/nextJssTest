import React from 'react'
import {UsergroupAddOutlined, LogoutOutlined, UserOutlined, FundProjectionScreenOutlined,
  FileProtectOutlined ,CloseOutlined } from '@ant-design/icons';
import {  Menu } from 'antd';
import {useRouter} from 'next/router';
import {AppDispatch} from "../../store/store";
import { useMediaQuery } from 'react-responsive';
import {setLogout} from "../../store/reducers/loginSlice";
import styles from "./sidemenu.module.scss";
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import {BaseURL} from "../../../constants"

export default function SideMenu(props: any) {
  const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' }) 
    const router = useRouter() 
    const loginData = useSelector((state:any) => state.login);
    loginData.userinfo.role
    const onClickMenu = async(e:any) =>{
    // console.log(e,"------------")
          if(e.key === "logout"){
                Cookies.remove('token', {
                  expires: 1 
                });
                await dispatch(setLogout())
                // router.push('/logout');
                if(loginData.userinfo.role === "admin"){
                  window.location.href = ""+BaseURL+"admin-login";
                }else{
                  window.location.href = ""+BaseURL+"login";
                }
                
          }else{
            if(isMobile){
              props.setCollapsed(!props.collapsed);
            }
            router.push('/'+e.key+'');
          }
    
    }
  return (
   <>
    <div className="logo" >
                    <h1 style={{   
                         color: "white",
                                  textAlign: "center",
                                  marginTop: "27px",
                                  textDecoration: "underline"}}>LoGO
                                   <CloseOutlined  className={styles.crossIcon} onClick={() => props.setCollapsed(!props.collapsed)} />
                                   </h1>
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.menuUser}>
                    <UserOutlined /> 
                    </div>
                 <span className={styles.userFName}>Welcome {loginData.userinfo.firstName}</span>
                  </div>
                
                  <Menu
                    theme="dark"
                    mode="inline"
                    onClick={onClickMenu}
                    defaultSelectedKeys={['dashboard']}
                    items={loginData.userinfo.role === "user" ? [
                      {
                        icon: FileProtectOutlined  ,
                        name:"Dashboard",
                        path:"dashboard"
                      },
                      {
                        icon: UsergroupAddOutlined ,
                        name:"Company",
                        path:"company"
                      },
                      {
                        icon: FundProjectionScreenOutlined,
                        name:"My Software",
                        path:"software"
                      },
                      {
                        icon: UserOutlined,
                        name:"Profile",
                        path:"profile"
                      },
                      {
                        icon: LogoutOutlined ,
                        name:"Logout",
                        path:"logout"
                      }

                     ].map(
                      (e, index) => ({
                        key: String(e.path),
                        icon: React.createElement(e.icon),
                        label: ` ${e.name}`,
                      }),
                    ) :[
                      {
                        icon: FileProtectOutlined  ,
                        name:"Dashboard",
                        path:"admin/dashboard"
                      },
                      {
                        icon: UserOutlined  ,
                        name:"Users",
                        path:"admin/users"
                      },
                      {
                        icon:  UsergroupAddOutlined,
                        name:"Companies",
                        path:"admin/companies"
                      },
                      {
                        icon: FundProjectionScreenOutlined,
                        name:"softwares",
                        path:"admin/softwares"
                      },
                      {
                        icon: LogoutOutlined ,
                        name:"Logout",
                        path:"logout"
                      }

                     ].map(
                      (e, index) => ({
                        key: String(e.path),
                        icon: React.createElement(e.icon),
                        label: ` ${e.name}`,
                      }),
                    ) }
                  />

   </>
  )
}
