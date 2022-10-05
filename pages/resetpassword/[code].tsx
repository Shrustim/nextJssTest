import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import api from "../../src/restApi/index";
import Spinner from "../../src/components/Spinner"
import { useEffect,useState } from 'react';
import { Button, Modal,Col, Row, Form, Input,Card  } from 'antd';
const apiobj = new api();
// const ResetPassword: NextPage = ({errorMessage}:any) => {
   const ResetPassword: NextPage = () => {
    const router = useRouter()
    const { code } = router.query
    const [errorMessage,setErrorMessage] = useState("");
    const [loading,setLoading] = useState(true)
    const [btnloading,setbtnLoading] = useState(false)
    useEffect(() => {
        const verifyLink = async () => {
            
            console.log("code",code)
            try {
                await apiobj.requestWithoutToken("users/resetpassword", {"code":code}, "post");
                setLoading(false)
               
               
            }catch(error: any){
                setLoading(false)
                Modal.error ({
                    title: error.message,
                    content: (
                      <div>
                      
                      </div>
                    ),
                    onOk() {
                        router.push('/');
                    },
                  });
                setErrorMessage(error.message);
            }
        }
        if(code){
            verifyLink();
        }
    },[code]);
    const onFinish = async(values:any) =>{
      console.log("values",values);
      setbtnLoading(true)
            try {
                var data = {
                    "code":code,
                    "isReset":true,
                    "password":values.password
                }
                await apiobj.requestWithoutToken("users/resetpassword",data, "post");
                setbtnLoading(false)
                Modal.success ({
                    title: "Password change successfully.",
                    content: (
                    <div>
                    
                    </div>
                    ),
                    onOk() {
                        router.push('/login');
                    },
                });
            }catch(error: any){
                setbtnLoading(false)
                setErrorMessage(error.message);
            }
    }



    if(loading){
        return (
            <Spinner/>
        )
    }
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
          <Card title="Reset Password" style={{ width: '100%' }}>
             <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
              
                <Form.Item
                  label="Password"
                  name="password"
                
                  rules={[{ required: true, message: 'Please enter your password.' },
                  
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value.length > 5 ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Password must contain a minimum of 6 characters.'));
                         
                    },
                  }),]}
                >
                  <Input.Password   />
                
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
                  <Button type="primary" htmlType="submit" loading={btnloading}>
                    Submit
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
// This gets called on every request
// export async function getServerSideProps({ params }:any) {
//     var errorMessage = ""
//     console.log(params)
//     // Fetch data from external API
//     try {
//       const response: any = await apiobj.requestWithoutToken("users/resetpassword", {"code":"93327180"}, "post");
//     }catch(error: any){
//         errorMessage = error.message
//     }
//   console.log("errorMessage",errorMessage)
//     // Pass data to the page via props
//     return { props: { errorMessage } }
//   }
  
export default ResetPassword
