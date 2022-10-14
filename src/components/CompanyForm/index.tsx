import type { NextPage } from 'next'
import {useState,useEffect} from "react"
import {Button, Form, Input  } from 'antd';
import {useRouter} from 'next/router';
import api from "../../../src/restApi/index";
import { useSelector } from 'react-redux';

const apiobj = new api();
export default function CompanyForm({id}:any) {
    const router = useRouter()
    const [form] = Form.useForm();
    const [company,setCompany]=useState();
    const [errorMessage,setErrorMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const userData = useSelector((state:any) => state.login.userinfo);
    const onFinish = async (values: any) => {
      if(id){
      var updateData = values;
      updateData.userId = userData.id;
      updateData.id = id;
      setCompany(updateData)
       setLoading(true);
       try {
          const response: any = await apiobj.request("company", updateData, "patch");
          // setCompany(updateData)
          setErrorMessage("")
          setLoading(false);
          // form.resetFields();
          router.push('/company');
        }catch(error: any){
          setLoading(false);
          setErrorMessage(error.message)
        }
     }else{
        var insertData = values;
        insertData.userId = userData.id
        setLoading(true);
        try {
          const response: any = await apiobj.request("company", insertData, "post");
          setErrorMessage("")
          setLoading(false);
          form.resetFields();
          router.push('/company');
        }catch(error: any){
          setLoading(false);
          setErrorMessage(error.message)
        }
     }
     
    }

    useEffect(() => {
      const getCompanyById = async() => {
        if(id){
          try {
            const response: any = await apiobj.request("company/"+id+"", {}, "get");
            setCompany(response.data[0])
          }catch(error: any){
            
          }
        }
      }
      getCompanyById();
    }, [id])
    useEffect(()=>{
      form.resetFields();
    })
  return (
         <Form
                name="basic"
                form={form}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
                initialValues={company}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Company name"
                  name="companyName"
                
                  rules={[{ required: true, message: 'Please enter company name.' },
                ]}
                >
                  <Input   />
                </Form.Item>

                <Form.Item
                  label="Contact person"
                  name="contactPerson"
                
                  rules={[{ required: true, message: 'Please enter contact person name.' }]}
                >
                  <Input   />
                </Form.Item>
                
                <Form.Item
                  label="email"
                  name="email"
                
                  rules={[{ required: true, message: 'Please enter email.' },
                  {
                    type: 'email',
                    message: 'The input is not valid email.',
                  },]}
                >
                  <Input   />
                </Form.Item>
                <Form.Item
                    name="websiteUrl"
                    label="Website URL"
                    // rules={[
                    //     { 
                    //        required: true,
                    //        message:"Please enter website URL."
                    //      }, { 
                    //         type: 'url',
                    //         message:"Please enter valid website URL." }
                    //    ]}
                >
                    <Input  />
                </Form.Item>

                <Form.Item
                  label="Phone number"
                  name="phoneNumber"
                
                  // rules={[{ required: true, message: 'Please enter phone number.' }]}
                >
                  <Input   />
                </Form.Item>

                  {errorMessage ? 
                 <>
                  <span className='ant-form-item-explain-error'>{errorMessage}</span>
                  <br/>
                 </>:null}
                <Form.Item >
                  <Button type="primary" htmlType="submit"  loading={loading}>
                    {id ? "Update" : "Add"}
                  </Button>
                  <Button htmlType="button" className="CancelButton" onClick={() => router.push('/company')}>
                    Cancel
                  </Button>
                 
                </Form.Item>
              </Form>
  )
}
