import type { NextPage } from 'next'
import {useState,useEffect} from "react"
import {Button, Form, Input,DatePicker,Select   } from 'antd';
import {useRouter} from 'next/router';
import api from "../../../src/restApi/index";
import { useSelector } from 'react-redux';
import moment from "moment";

const apiobj = new api();
const { TextArea } = Input;
const { Option } = Select;
export default function SoftwareForm({id}:any) {
    const router = useRouter()
    const [form] = Form.useForm();
    const [software,setSoftware]=useState<any>({});
    const [companylist,setCompanylist]=useState([]);
    const [softwareTypelist,setSoftwareTypelist]=useState([]);
    const [errorMessage,setErrorMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const userData = useSelector((state:any) => state.login.userinfo);
    const onFinish = async (values: any) => {
     if(id){
      var updateData = values;
      updateData.userId = userData.id;
      updateData.id = id;
      updateData.softwareCode = software.softwareCode;
      setSoftware(updateData)
       setLoading(true);
       try {
          const response: any = await apiobj.request("software", updateData, "patch");
          setErrorMessage("")
          setLoading(false);
          form.resetFields();
          router.push('/software');
        }catch(error: any){
          setLoading(false);
          setErrorMessage(error.message)
        }
     }else{
        var insertData = values;
        insertData.userId = userData.id
        setLoading(true);
        try {
          const response: any = await apiobj.request("software", insertData, "post");
          setErrorMessage("")
          setLoading(false);
          form.resetFields();
          router.push('/software');
        }catch(error: any){
          setLoading(false);
          setErrorMessage(error.message)
        }
     }
     
    }

   
    useEffect(() => {
      const getSelectTagData =async () => {
         await getSoftwareTypeList();
         await getCompanyList();
      }
       getSelectTagData();
    },[])
    const getSoftwareTypeList =  async() => {
       try {
          const response: any = await apiobj.request("softwaretypes", {}, "get"); 
          setSoftwareTypelist(response.data)
        }catch(error: any){
        }
    }
    const getCompanyList =  async() => {
      try {
         const response: any = await apiobj.request("company/dropdown", {}, "get"); 
         setCompanylist(response.data)
       }catch(error: any){
       }
   }

   useEffect(() => {
    const getSoftwareById = async() => {
      form.resetFields();
      if(id){
        try {
          const response: any = await apiobj.request("software/"+id+"", {}, "get");
          let data:any = response.data[0];
          data.releaseDttm =moment(moment(parseInt(data.releaseDttm))) ; 
          setSoftware(data)
        }catch(error: any){
          
        }
      }
    }
    getSoftwareById();
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
                initialValues={software}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Software name"
                  name="softwareName"
                
                  rules={[{ required: true, message: 'Please enter software name.' },
                ]}
                >
                  <Input   />
                </Form.Item>

                 <Form.Item
                  label="Release Date"
                  name="releaseDttm"
                
                  rules={[{ required: true, message: 'Please enter release date.' }]}
                >
                  <DatePicker style={{width:"100%"}} format="MM-DD-YYYY"/>
                </Form.Item> 
                 
                <Form.Item
                  label="Version"
                  name="version"
                
                  rules={[{ required: true, message: 'Please enter version.' },
                ]}
                >
                  <Input   />
                </Form.Item>
               

                 <Form.Item
                    name="softwareTypeId"
                    label="Software Type"
                    rules={[{ required: true, message: 'Please select software type.' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select a software type"
                    optionFilterProp="children"
                  filterOption={(input, option) =>
                      (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {
                    softwareTypelist.length > 0 ?
                          softwareTypelist.map((e:any) => {
                              return ( 
                                <Option value={e.id} key={e.id}>{e.softwareTypeName}</Option>
                              )
                            })
                    : null
                   }
                  </Select>
                </Form.Item> 

                 <Form.Item
                    name="companyId"
                    label="Company"
                    rules={[{ required: true, message: 'Please select company.' }]}
                >
                 <Select
                    showSearch
                    placeholder="Select a company"
                    optionFilterProp="children"
                  filterOption={(input, option) =>
                      (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                   {
                    companylist.length > 0 ?
                            companylist.map((e:any) => {
                              return ( 
                                <Option value={e.id} key={e.id}>{e.companyName}</Option>
                              )
                            })
                    : null
                   }
                  </Select>
                </Form.Item> 

                <Form.Item
                    name="description"
                    label="Description"
                   
                >
                  <TextArea rows={4} />
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
                  <Button htmlType="button" className="CancelButton" onClick={() => router.push('/software')}>
                    Cancel
                  </Button>
                 
                </Form.Item>
              </Form>
  )
}
