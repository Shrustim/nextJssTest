import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect,useRef} from "react"
import { Button ,Space, Table, Tag} from 'antd';
import api from "../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux';;

const apiobj = new api();
interface DataType {
  key: string;
  id : number;
  companyName: string;
  contactPerson: string;
  email: string;
  websiteUrl: string;
  phoneNumber: string;
}

const Company: NextPage = () => {
  const [company,setCompany] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const userData = useSelector((state:any) => state.login.userinfo);
  useEffect(()=>{
    getCompanyList();
  },[])
  const getCompanyList= async()=>{
    // console.log("userData===========",userData)
    // console.log("useEffect called",userData.id)
     if(userData.id){
        setIsLoading(true);
        console.log(userData.id)
        try {
          const response: any = await apiobj.request("company/companiesbyuid", {"userId": userData.id}, "post");
          setCompany(response.data)
          setIsLoading(false);
        }catch(error: any){
          setIsLoading(false);
        }
      
     }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Website URL',
      dataIndex: 'websiteUrl',
      key: 'websiteUrl',
    },
    {
      title: 'Phone number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/company/${record.id}`} > Edit  </Link>
          {/* <a>Delete</a> */}
        </Space>
      ),
    },
  ];
  return (
      <div className='space-Top'>
        <h2>Company List

        <Link href="/company/create" >
           <Button type="primary" style={{float:"right"}}>Add</Button>
            </Link>
        </h2>
           <br/><br/>
           <div className="responsivTable">
            <Table 
            loading={isLoading}
            columns={columns} dataSource={company.map((el: any, idx: any) => ({
                                key: idx,
                                ...el
                              }))} />
           </div>                   
      </div>
  )
}

export default Company
