import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect} from "react"
import { Col, Row,Card,Form, Input,Button,message } from 'antd';
import api from "../src/restApi/index";
import { useSelector, useDispatch } from 'react-redux';
import {AppDispatch} from "../src/store/store";
import jwt_decode from "jwt-decode";
import {fetchUserById} from "../src/store/reducers/loginSlice";
import Cookies from 'js-cookie'
const apiobj = new api();
const Profile: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessage,setErrorMessage] = useState("");
  const [loading,setLoading] = useState(false);
  const loginData = useSelector((state:any) => state.login);
 
  const onFinish = async(values: any) => {
            // console.log('Success:', values);
            setLoading(true);
            try {
              const updateData = {
                 "firstName":values.firstName,
                 "lastName":values.lastName
              }
               const response: any = await apiobj.request("users", updateData, "patch");
              var token:any = Cookies.get('token');
              var token_data: any = jwt_decode(token);
              await dispatch(fetchUserById(parseInt(token_data.sub)))
              
              setLoading(false);
              message.success('This is a success message');
              setErrorMessage("")
             }catch(error: any){
              setLoading(false);
              setErrorMessage(error.message)
            }

  }
// console.log("users",users)
  return (
    <div>  <h2>Profile</h2>

    {/* <Link href="/software/create" >
       <Button type="primary" style={{float:"right"}}>Add</Button>
        </Link> */}
    
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
            <Row>
        {/* <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
        lg={{ span: 6 }}  xl={{ span: 7 }} xxl={{ span: 7 }}>
          
        </Col> */}
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 24 }} 
        lg={{ span: 18 }}  xl={{ span: 12 }} xxl={{ span: 12 }}>
          <Card title="Edit" style={{ width: "100%" }}>
          <Form
                name="basic"
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 24 }}
                initialValues={loginData.userinfo}
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
                  <Input disabled   data-testid="email-test" />
                </Form.Item>

                <Form.Item
                  label="First name"
                  name="firstName"
                
                  rules={[{ required: true, message: 'Please enter your first name.' }]}
                >
                  <Input data-testid="firstName-test"  />
                </Form.Item>
                
                <Form.Item
                  label="Last name"
                  name="lastName"
                
                  rules={[{ required: true, message: 'Please enter your last name.' }]}
                >
                  <Input data-testid="lastName-test"  />
                </Form.Item>
                

                {/* <Form.Item
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
                    <Input.Password  data-testid="password-test" />
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
                    <Input.Password  data-testid="confirmpassword-test" />
                  </Form.Item> */}

                  {errorMessage ? 
                 <>
                  <span className='ant-form-item-explain-error'>{errorMessage}</span>
                  <br/>
                 </>:null}
                <Form.Item >
                  <Button type="primary" htmlType="submit" data-testid="submit-signup"  loading={loading}>
                    Submit
                  </Button>
                  {/* <Button htmlType="button" className={styles.CancelButton} onClick={() => router.push('/')}>
                    Cancel
                  </Button>
                  <Button type="link" htmlType="button" onClick={() => router.push('/login')}>
                  Sign In
                  </Button> */}
                </Form.Item>
              </Form>
            </Card>
         
        </Col>
     
     </Row>
            
          
             <br/>
          <br/>
        
            </div>
  )
}

export default Profile
