import React,{useEffect,useState} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router';
import FooterComp from '../Footer';
import jwt_decode from "jwt-decode";
import HeaderComp from '../Header'
import { useSelector, useDispatch } from 'react-redux';
import {AppDispatch} from "../../store/store"
import {setLogin,fetchUserById} from "../../store/reducers/loginSlice";
import Cookies from 'js-cookie'
import Spinner from "../../components/Spinner"
import { Layout } from 'antd';
import styles from "./Layout.module.scss";


const { Header , Footer, Content } = Layout;
function LayoutComp(props:any) {
    const [isLoading,setIsLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()
    // 
    // const loginData = useSelector((state:any) => state.login);
    
    useEffect(() => {
      getUserData();
    },[]);
     
    const getUserData = async() => {
      setIsLoading(true)
      
      if(Cookies.get('token')){
        var token_data: any = jwt_decode(Cookies.get('token') || "");
        if(token_data.sub && token_data.sub > 0){
        //  await dispatch(setLogin())
         await dispatch(fetchUserById(parseInt(token_data.sub)))
         setIsLoading(false)
        }
        else{
          setIsLoading(false)
        }

      }else{
        setIsLoading(false)
      }
    }
  return (
    
    <div>
      {
           isLoading ? 
           <Spinner />
           :
           <>
              <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
              </Head>
              {(router.pathname === "/login" || router.pathname === "/signup" || router.pathname === "/resetpassword/[code]") ?
                <div>
                    {props.children}
                </div>
                :
                <Layout>
                    <Header>
                      <HeaderComp/>
                    </Header>   
                    <Content>
                        <div className={styles.container}>
                           {props.children}
                        </div>
                    </Content>
                    <Footer>
                      <FooterComp/>
                    </Footer>
                </Layout>     
              }
           </>
      }
    </div>
 
  )
}

export default LayoutComp