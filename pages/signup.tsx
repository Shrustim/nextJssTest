import type { NextPage } from 'next'
import {useState} from "react"
import jwt_decode from "jwt-decode";
import { Col, Row, Button, Form, Input,Card  } from 'antd';
import {useRouter} from 'next/router';
import { useSelector, useDispatch } from 'react-redux'
import styles from '../styles/Login.module.scss'
import api from "../src/restApi/index";
import {AppDispatch} from "../src/store/store"
import { NextResponse } from 'next/server'
import {setLogin,fetchUserById} from "../src/store/reducers/loginSlice"
import Cookies from 'js-cookie'
const apiobj = new api();
const SignUp: NextPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessage,setErrorMessage] = useState("");
  const [loading,setLoading] = useState(false);
  const onFinish = async(values: any) => {
    // console.log('Success:', values);
    setLoading(true);
    try {
      const response: any = await apiobj.requestWithoutToken("users/signup", values, "post");
      // localStorage.setItem("token", response.data.token);
      var token_data: any = jwt_decode(response.data.token);
      const responsee = NextResponse.next()
      Cookies.set('token', response.data.token, { expires: 30 })
      await dispatch(setLogin())
      await dispatch(fetchUserById(parseInt(token_data.sub)))
      setErrorMessage("")
      setLoading(false);
      router.push('/');
    }catch(error: any){
      setLoading(false);
      console.log(error);
      console.log(error.message)
      setErrorMessage(error.message)
    }
    
  };
  return (
    <div>
    <Row>
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
        lg={{ span: 7 }}  xl={{ span: 8 }} xxl={{ span: 8 }}>
          
        </Col>
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 12 }} 
        lg={{ span: 10 }}  xl={{ span: 8 }} xxl={{ span: 8 }}>
          <br/>
          <br/>
          <Card title="Sign Up" style={{ width: '100%' }}>
             <Form
                name="basic"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Email"
                  name="email"
                
                  rules={[{ required: true, message: 'Please enter your email.' },
                  {
                    type: 'email',
                    message: 'The input is not valid email.',
                  },]}
                >
                  <Input   />
                </Form.Item>

                <Form.Item
                  label="First name"
                  name="firstName"
                
                  rules={[{ required: true, message: 'Please enter your first name.' }]}
                >
                  <Input   />
                </Form.Item>
                
                <Form.Item
                  label="Last name"
                  name="lastName"
                
                  rules={[{ required: true, message: 'Please enter your last name.' }]}
                >
                  <Input   />
                </Form.Item>
                

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password.',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value.length > 5 ) {
                            return Promise.resolve();
                          }
                            return Promise.reject(new Error('Password must contain a minimum of 6 characters.'));
                          // var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                          // if (value && regex.test(value) && value.length >=8) {
                          //   return Promise.resolve();
                          // }
                          // if(value  || !regex.test(value) || value.length < 8) {
                          //   if(value && !regex.test(value)) {
                          //      return Promise.reject(new Error('Your password must contain at least one letter or one digit.'));
                          //    }
                          //    else if(value  && value.length < 8) {
                          //      return Promise.reject(new Error('Your password must be at least 8 characters'));
                          //    }
                          // }
                         
                          
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password.',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  {errorMessage ? 
                 <>
                  <span className='ant-form-item-explain-error'>{errorMessage}</span>
                  <br/>
                 </>:null}
                <Form.Item >
                  <Button type="primary" htmlType="submit"  loading={loading}>
                    Submit
                  </Button>
                  <Button htmlType="button" className={styles.CancelButton} onClick={() => router.push('/')}>
                    Cancel
                  </Button>
                  <Button type="link" htmlType="button" onClick={() => router.push('/login')}>
                  Sign In
                  </Button>
                </Form.Item>
              </Form>
        </Card>
          {/* <h2>Login</h2> */}
         
        </Col>
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
        lg={{ span: 7 }}  xl={{ span: 8 }} xxl={{ span: 8 }}>
          
        </Col>
     </Row>

    </div>
  )
}

export default SignUp