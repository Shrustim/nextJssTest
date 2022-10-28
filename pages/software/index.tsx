import type { NextPage } from 'next'
import Link from 'next/link'
import {useState,useEffect} from "react"
import {Col, Row, Button ,Space, DatePicker,Table, Input } from 'antd';
import api from "../../src/restApi/index";
import type { ColumnsType } from 'antd/es/table'
import { useSelector } from 'react-redux';
import moment from "moment";
import {InfoOutlined,EditOutlined } from '@ant-design/icons';
import useDidMountEffectWithSearchDelay  from "../../src/customHooks/useDidMountEffectWithSearch"

const { RangePicker } = DatePicker;
const apiobj = new api();
interface DataType {
  key: string;
  id : number;
  softwareName: string;
  releaseDttm: number;
  version: string;
  description: string;
  phoneNumber: string;
  softwareCode: string;
  apiCallsCount: number;
}

const Softwares: NextPage = () => {
  const [software,setSoftwares] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [startDate,setStartDate] = useState<any>();
  const [endDate,setEndDate] = useState<any>();
  const [filterVersion,setFilterVersion] = useState("");
  const [filterSoftwareCode,setFilterSoftwareCode] = useState("");
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
  const getDate = (e:any) => {
    console.log(e)
    if(e) {
      setStartDate(e[0]._d)
      setEndDate(e[1]._d)
    }else{
      setStartDate("");
      setEndDate("");
    }
   
   }

  
  useEffect(()=>{
    const getData = async() => {
      setIsLoading(true); 
      try {
          await getCountSoftwaresList();
          await getSoftwaresList(0);
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
            await getCountSoftwaresList();
            await getSoftwaresList(0);
            setIsLoading(false);
        }
        catch(error: any){
          setIsLoading(false);
        }
  }
  useDidMountEffectWithSearchDelay(() => {
    getDataOnSearch();
    
  },[filterVersion,filterSoftwareCode,filterSoftwareName,endDate])
  
  const getCountSoftwaresList = async() => {
        if(userData.id){
          try {
            const response: any = await apiobj.request("software/softwarebyuid",
                        { "userId": userData.id,"count":true,
                          "softwareName" : filterSoftwareName,
                          "softwareCode": filterSoftwareCode,
                          "version":filterVersion,
                          "startDate":startDate,
                          "endDate":endDate
                         }, 
                        "post");
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
  const getSoftwaresList= async(offsetValue: number)=>{
     if(userData.id){
        try {
          const response: any = await apiobj.request("software/softwarebyuid", 
          {"userId": userData.id,"offset":offsetValue,
           "softwareName" : filterSoftwareName,
           "softwareCode": filterSoftwareCode,
           "limit":tableParams.pagination.pageSize,
           "version":filterVersion,
           "startDate":startDate,
           "endDate":endDate
          }, "post");
          setSoftwares(response.data)
        }catch(error: any){
        }
      
     }
  }
  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };
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
      getSoftwaresList(offset);
      setIsLoading(false);
    }catch(error: any){
      setIsLoading(false);
    }  
  }


  const columns: ColumnsType<DataType> = [
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
            <Link href={`/software/detail/${record.softwareCode}`} > 
           <Button shape="circle" icon={<InfoOutlined />} /> 
           </Link>
          <Link href={`/software/${record.id}`} > 
           <Button shape="circle" icon={<EditOutlined />} />
            </Link>
        </Space>
      ),
    },
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
      title: 'Software code',
      dataIndex: 'softwareCode',
      key: 'softwareCode',
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
      title:"API Calls Count",
      dataIndex:"apiCallsCount",
      key:"apiCallsCount"
    }
   
   
  ];
  return (
      <div className='space-Top'>
        <h2>Software List

        <Link href="/software/create" >
           <Button type="primary" style={{float:"right"}}>Add</Button>
            </Link>
        </h2> 
           <br/>
           <br/>
           <Row>
           <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 7 }} 
           lg={{ span: 7 }}  xl={{ span: 7 }} xxl={{ span: 7 }}>
              <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Release Date:</label>
                <RangePicker onChange={getDate} disabledDate={disabledDate} />
                </div>
            
           </Col>
            
           <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 7 }} 
           lg={{ span: 7 }}  xl={{ span: 7 }} xxl={{ span: 7 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Software Name:</label>
                  <Input placeholder="Software Name " value={filterSoftwareName} 
                  onChange={(e) => {setFilterSoftwareName(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
          </Col>
          
          <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 5 }} 
           lg={{ span: 5 }}  xl={{ span: 5 }} xxl={{ span: 5 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                <label>Software Code:</label>
                  <Input placeholder="Software Code" value={filterSoftwareCode} 
                  onChange={(e) => { setFilterSoftwareCode(e.target.value)}}
                  style={{width:"100%"}} />
                </div>
            </Col>
          <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 5 }} 
           lg={{ span: 5 }}  xl={{ span: 5 }} xxl={{ span: 5 }}>
                <div    style={{padding:"5px 5px 5px 0px"}}>
                  <label>Version:</label>
                  <Input placeholder="Version " value={filterVersion} 
                   onChange={(e) => {setFilterVersion(e.target.value)}}
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
            columns={columns} dataSource={software.map((el: any, idx: any) => ({
                                key: idx,
                                ...el
                              }))} 
            onChange={handleTableChange} 
            pagination={tableParams.pagination}  
                                                />
           </div>                   
      </div>
  )
}

export default Softwares
