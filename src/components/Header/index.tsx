import React from 'react'
import {useRouter} from 'next/router';
import {AppDispatch} from "../../store/store"
import { useSelector, useDispatch } from 'react-redux';
import {setLogout} from "../../store/reducers/loginSlice";
import Cookies from 'js-cookie'
import {LogoutOutlined ,MenuFoldOutlined,UserOutlined} from '@ant-design/icons';
import {BaseURL} from "../../../constants"
import { Button } from 'antd';
import styles from "./header.module.scss";
function Header(props: any) {
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
    if(loginData.userinfo.role === "admin"){
      window.location.href = ""+BaseURL+"admin-login";
    }else{
      window.location.href = ""+BaseURL+"login";
    }
  }
  return ( 
    <div>
        
      <h2 className="mobileLogo" > 
      <MenuFoldOutlined className={styles.slideIcon} onClick={() => props.setCollapsed(!props.collapsed)} />
      LoGO
      <Button type="primary" className={styles.userIcon} shape="circle" icon={<UserOutlined />} />
      {
      loginData.isLogin ?  <a href="#" className={styles.logoutIcon}  onClick={logout}><LogoutOutlined/></a> : null
    } 
    
    </h2>
   
      
    
    </div>
  )
}

export default Header