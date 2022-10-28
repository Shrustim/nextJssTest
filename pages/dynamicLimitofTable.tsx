import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect,useRef} from "react"
import {Col, Row, Button ,Space, Table, Input } from 'antd';
import api from "../src/restApi/index";
import type { ColumnsType } from 'antd/es/table';
import {InfoOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from "moment";
import useDidMountEffectWithSearchDelay  from "../src/customHooks/useDidMountEffectWithSearch"

const apiobj = new api();
interface DataType {
  key: string;
  id : number;
  created_at: string;
  lastLoggedDttm: number;
  ending_at: string;
  role: string;
  email: string;
}

const Books: NextPage = () => {
  const [users,setBooks] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
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
  //    getBooksList();
  // },[])
  // const getBooksList= async()=>{
  //   if(userData.id){
  //       setIsLoading(true);
  //       try {
  //         const response: any = await apiobj.request("users", {}, "get");
  //         setBooks(response.data)
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
          await getCountBooksList();
          await getBooksList(0);
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
            await getCountBooksList();
            await getBooksList(0);
            setIsLoading(false);
        }
        catch(error: any){
          setIsLoading(false);
        }
  }
//   useDidMountEffectWithSearchDelay(() => {
//     getDataOnSearch();
    
//   },[filteruserName,filterEmail,filterSoftwareName])
  
  const getCountBooksList = async() => {
        if(userData.id){
          try {
            const response: any = await apiobj.request("samplefortest/book?count=true",
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
  const getBooksList= async(offsetValue: number)=>{
     if(userData.id){
        try {
          const response: any = await apiobj.request("samplefortest/book?offset="+offsetValue+"&limit="+tableParams.pagination.pageSize+"", 
          {
          //   "userId": userData.id,"offset":offsetValue,
          //  "softwareName" : filterSoftwareName,
          //  "email": filterEmail,
          //  "version":filteruserName
          }, "get");
          setBooks(response.data)
        }catch(error: any){
        }
      
     }
  }
   // Pagination on change.
   const handleTableChange= async (pagination:any, filters:any, sorter:any) => {
    console.log("pagination",pagination)
    console.log("exits pagination",tableParams)
    const count=pagination.pageSize;
    const pager = tableParams;
    pager.pagination.pageSize = pagination.pageSize
    pager.pagination.current = pagination.current;
    var offset :number= ( pager.pagination.current - 1) * count;	
    setTableParams(pager);
    setIsLoading(true); 
    try {
      getBooksList(offset);
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
      dataIndex: 'created_at',
      key: 'created_at',
    },
   
    {
      title: 'Last name',
      dataIndex: 'ending_at',
      key: 'ending_at',
    }
  ];
  return (
      <div className='space-Top'>
        <h2>Books List

      
        </h2>
        <br/>

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
                              pagination={
                                tableParams.pagination
                                // ,
                                //   showTotal=(total:any) => `Total ${total} items`
                            } 
                              // showTotal={total => `Total ${total} items`}
                              />
                   </div>           
      </div>
  )
}

export default Books
