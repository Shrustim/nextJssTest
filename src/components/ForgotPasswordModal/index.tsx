import React, { useState,useEffect } from 'react';
import { Button, Modal,Form, Input } from 'antd';
import api from "../../../src/restApi";
import styles from "./forgotpasswordmodal.module.scss"
const apiobj = new api();
export default function ForgotPasswordModal({isModalShow,forgotpasswordEmail,
    setIsForgotPasswordModal}: any) {
       const [errorMessage,setErrorMessage] = useState("");
       const [loading,setLoading] = useState(false);
       
        const onGetPasswordResetLink = async(values: any) => {
             console.log(values)
             setLoading(true)
             try {
                await apiobj.requestWithoutToken("users/forgotpasswordemail", values, "post");
                setErrorMessage("")
                setIsForgotPasswordModal(false)
                Modal.success({
                    content: 'Email sent successfully for reset password.',
                  });
                setLoading(false)
              }catch(error: any){
                setErrorMessage(error.message)
                setLoading(false)
              }
        }
     
  return (
    <Modal title="Forgot Password" 
    open={isModalShow} 
    maskClosable={false}
    footer={null} >
     <h4>Enter the email you used to create your account on MySoftwareUpdate, and you'll receive an email to reset your password.</h4>
      <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ email: forgotpasswordEmail }}
                onFinish={onGetPasswordResetLink}
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
                  <Input  />
                </Form.Item>
                {errorMessage ? 
                 <>
                  <span className='ant-form-item-explain-error'>{errorMessage}</span>
                  <br/>
                 </>:null}
               <Form.Item style={{ textAlign: 'right' }}>
                 <Button type="primary" htmlType="submit" loading={loading}>
                   OK
                 </Button>
                 <Button htmlType="button"  className={styles.CancelButton}   onClick={() =>setIsForgotPasswordModal(false)}>
                   Cancel
                 </Button>
                
               </Form.Item>
             </Form>
  </Modal>
  )
}
