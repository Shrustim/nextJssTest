import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect,useRef} from "react"
import { Button ,Space, Table, Tag} from 'antd';
import api from "../../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux';
import moment from "moment";

const apiobj = new api();
interface DataType {
  key: string;
  id : number;
  softwareName: string;
  releaseDttm: number;
  version: string;
  description: string;
  phoneNumber: string;  
  firstName: string;
  email: string;
  lastName:string;
  companyEmail: string;
}

const Softwares: NextPage = () => {
  const [software,setSoftwares] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const userData = useSelector((state:any) => state.login.userinfo);
  useEffect(()=>{
     getSoftwaresList();
  },[])
  const getSoftwaresList= async()=>{
    if(userData.id){
        setIsLoading(true);
        try {
          const response: any = await apiobj.request("software", {}, "get");
          setSoftwares(response.data)
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
      title: 'Software Name',
      dataIndex: 'softwareName',
      key: 'softwareName',
    },
    {
      title: 'Release Date',
      dataIndex: 'releaseDttm',
     render: (text: any) => moment(new Date(parseInt(text))).format("MM/DD/YYYY hh:mm A")
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
        title: 'Company name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    {
      title: 'Software type',
      dataIndex: 'softwareTypeName',
      key: 'softwareTypeName',
    },
    {
      title: 'User\'s name',
      render: (_, record) => (
        <span>{record.firstName} {record.lastName} </span>
      )
    },
    {
      title: 'User\'s email',
      render: (_, record) => (
        <span>{record.email}  </span>
      )
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Link href={`/software/${record.id}`} > Edit  </Link>
    //       {/* <a>Delete</a> */}
    //     </Space>
    //   ),
    // },
  ];
  return (
      <div className='space-Top'>
        <h2>Software List

       
        </h2>
           <br/><br/>
            <Table 
            loading={isLoading}
            columns={columns} dataSource={software.map((el: any, idx: any) => ({
                                key: idx,
                                ...el
                              }))} />
      </div>
  )
}

export default Softwares
