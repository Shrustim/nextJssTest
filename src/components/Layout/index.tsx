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
import SideMenu from '../SideMenu';
import { useMediaQuery } from 'react-responsive'
import styles from "./Layout.module.scss";


const { Header , Footer, Content,Sider  } = Layout;
function LayoutComp(props:any) {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    const [isLoading,setIsLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(isMobile ? true : false );
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()
   
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
    console.log("router.asPath",router.asPath)
  return (
    
    <div>
      {
           isLoading ? 
           <Spinner />
           :
           <>
              <Head>
                <title>My Software Update</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
              </Head>
              {(router.pathname  && router.pathname === "/login" || router.pathname === "/admin-login"  ||router.pathname === "/404" || router.pathname === "/" || router.pathname === "/signup" || router.pathname === "/resetpassword/[code]") ?
                <div>
                    {props.children}
                </div>
                :
                <Layout>
                    <Sider
                    trigger={null}
                    width={250}
                    collapsible 
                      breakpoint="sm"
                     collapsedWidth="0"
                      onBreakpoint={broken => {
                        console.log(broken);
                      }}
                      onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                      }}
                      collapsed={collapsed}
                    >
                      <SideMenu setCollapsed={setCollapsed} collapsed={collapsed}/>

                    </Sider>
                    <Layout>
                        <Header>
                          <HeaderComp setCollapsed={setCollapsed} collapsed={collapsed}/>
                        </Header>   
                        <Content>
                            <div className={styles.container}>
                              <div className='wrapper-div'>
                              {props.children}
                              </div>
                             
                            </div>
                        </Content>
                        <Footer>
                          <FooterComp/>
                        </Footer>
                    </Layout>    
                 </Layout> 
              }
           </>
      }
    </div>
 
  )
}

export default LayoutComp