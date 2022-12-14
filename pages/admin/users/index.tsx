import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect,useRef} from "react"
import {Col, Row, Button ,Space, Table, Input } from 'antd';
import api from "../../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table';
import {InfoOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from "moment";
import useDidMountEffectWithSearchDelay  from "../../../src/customHooks/useDidMountEffectWithSearch"

const apiobj = new api();
interface DataType {
  key: string;
  id : number;
  firstName: string;
  lastLoggedDttm: number;
  lastName: string;
  role: string;
  email: string;
}

const Users: NextPage = () => {
  const [users,setUsers] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [filteruserName,setFilteruserName] = useState("");
  const [filterEmail,setFilterEmail] = useState("");
  const [filterSoftwareName,setFilterSoftwareName] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showQuickJumper:true,
      total: 0,
      responsive:true,
      showLessItems:true,
      showTotal:(total:any, range:any) => `${range[0]}-${range[1]} of ${total} items`
    },
  });
  const userData = useSelector((state:any) => state.login.userinfo);
  // useEffect(()=>{
  //    getUsersList();
  // },[])
  // const getUsersList= async()=>{
  //   if(userData.id){
  //       setIsLoading(true);
  //       try {
  //         const response: any = await apiobj.request("users", {}, "get");
  //         setUsers(response.data)
  //         setIsLoading(false);
  //       }catch(error: any){
  //         setIsLoading(false);
  //       }
      
  //   }
  // }
  useEffect(()=>{
    const getData = async() => {
      setIsLoading(true); 
      try {
          await getCountUsersList();
          await getUsersList(0);
          setIsLoading(false);
      }
      catch(error: any){
        setIsLoading(false);
      }
    }
    getData();
  },[])
  const getDataOnSearch = async() => {
        setIsLoading(true); 
        try {
            await getCountUsersList();
            await getUsersList(0);
            setIsLoading(false);
        }
        catch(error: any){
          setIsLoading(false);
        }
  }
  useDidMountEffectWithSearchDelay(() => {
    getDataOnSearch();
    
  },[filteruserName,filterEmail,filterSoftwareName])
  
  const getCountUsersList = async() => {
        if(userData.id){
          try {
            const response: any = await apiobj.request("users?count=true&email="+filterEmail+"&userName="+filteruserName+"",
                        { 
                          // "userId": userData.id,"count":true,
                          // "softwareName" : filterSoftwareName,
                          // "email": filterEmail,
                          // "version":filteruserName
                         }, 
                        "get");
            setTableParams({
              ...tableParams,
              pagination: {
                ...tableParams.pagination,
                total:  response.data[0].count || 0
              },
            });
           }catch(error: any){
          }
        
      }
  }
  const getUsersList= async(offsetValue: number)=>{
     if(userData.id){
        try {
          const response: any = await apiobj.request("users?limit="+tableParams.pagination.pageSize+"&offset="+offsetValue+"&email="+filterEmail+"&userName="+filteruserName+"", 
          {
          //   "userId": userData.id,"offset":offsetValue,
          //  "softwareName" : filterSoftwareName,
          //  "email": filterEmail,
          //  "version":filteruserName
          }, "get");
          setUsers(response.data)
        }catch(error: any){
        }
      
     }
  }
   // Pagination on change.
   const handleTableChange= async (pagination:any, filters:any, sorter:any) => {
    const count=pagination.pageSize;
    const pager = tableParams;
    pager.pagination.current = pagination.current;
    pager.pagination.pageSize = pagination.pageSize;
    var offset :number= ( pager.pagination.current - 1) * count;	
    setTableParams(pager);
    setIsLoading(true); 
    try {
      getUsersList(offset);
      setIsLoading(false);
    }catch(error: any){
      setIsLoading(false);
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Last loggedIn',
      dataIndex: 'lastLoggedDttm',
     render: (text: any) => text ? moment(new Date(parseInt(text))).format("MM/DD/YYYY hh:mm A") : ""
    },
    {
      title: 'Companies',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
         <Link href={`/admin/companies/${record.id}`} > 
           <Button shape="circle" icon={<InfoOutlined />} /> 
           </Link>
        </Space>
      ),
    },
  ];
  return (
      <div className='space-Top'>
        <h2>Users List

      
        </h2>
        <br/>
           <Row>
          <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 12 }} 
           lg={{ span: 12 }}  xl={{ span: 12}} xxl={{ span: 12 }}></Col>
            
             <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Email:</label>
                  <Input placeholder="Email" value={filterEmail} 
                  onChange={(e) => { setFilterEmail(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
            </Col>
            
          <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
           lg={{ span: 6 }}  xl={{ span: 6 }} xxl={{ span: 6 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                  <label>Name:</label>
                  <Input placeholder="Name " value={filteruserName} 
                   onChange={(e) => {setFilteruserName(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
            </Col>
          {/* <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 1 }} 
           lg={{ span: 1 }}  xl={{ span: 1 }} xxl={{ span: 1}}>
                <div    style={{padding:"27px 5px 5px 0px"}}>
                <Button type="primary" onClick={()=> getDataOnSearch()} shape="circle" icon={<SearchOutlined />} />
                </div>
          </Col> */}
          </Row>
          <br/>
          <div className="responsivTable">
            <Table 
                              size="middle"
                              loading={isLoading}
                              columns={columns} dataSource={users.map((el: any, idx: any) => ({
                                                  key: idx,
                                                  ...el
                                                }))} 
                              onChange={handleTableChange} 
                              pagination={tableParams.pagination}  />
                   </div>           
      </div>
  )
}

export default Users
