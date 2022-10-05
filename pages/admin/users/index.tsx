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
  firstName: string;
  lastLoggedDttm: number;
  lastName: string;
  role: string;
}

const Softwares: NextPage = () => {
  const [users,setUsers] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const userData = useSelector((state:any) => state.login.userinfo);
  useEffect(()=>{
     getSoftwaresList();
  },[])
  const getSoftwaresList= async()=>{
    if(userData.id){
        setIsLoading(true);
        try {
          const response: any = await apiobj.request("users", {}, "get");
          setUsers(response.data)
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
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
   
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Last loggedIn',
      dataIndex: 'lastLoggedDttm',
     render: (text: any) => moment(new Date(parseInt(text))).format("MM/DD/YYYY hh:mm A")
    },
  
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Link href={`/users/${record.id}`} > Edit  </Link>
    //       {/* <a>Delete</a> */}
    //     </Space>
    //   ),
    // },
  ];
  return (
      <div className='space-Top'>
        <h2>Users List

      
        </h2>
           <br/><br/>
            <Table 
            loading={isLoading}
            columns={columns} dataSource={users.map((el: any, idx: any) => ({
                                key: idx,
                                ...el
                              }))} />
      </div>
  )
}

export default Softwares
