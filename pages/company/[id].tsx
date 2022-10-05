import type { NextPage } from 'next'
import { Col, Row,Card,Button } from 'antd';
import CompanyForm from '../../src/components/CompanyForm';
import Link from 'next/link'
import { useRouter } from 'next/router'
const CompanyEdit: NextPage = () => {
    const router = useRouter()
    const { id } = router.query

  return (
      <div className='space-Top'>
        
       <Row>
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
        lg={{ span: 6 }}  xl={{ span: 7 }} xxl={{ span: 7 }}>
          
        </Col>
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 12 }} 
        lg={{ span: 12 }}  xl={{ span: 10 }} xxl={{ span: 10 }}>
          <br/>
          <br/>
          <Card title="Update Company" style={{ width: '100%' }}>
              <CompanyForm id={id} />
          </Card>
         
        </Col>
        <Col xs={{ span: 24}} sm={{ span: 24 }} md={{ span: 6 }} 
        lg={{ span: 6 }}  xl={{ span: 7 }} xxl={{ span: 7 }}>
          
        </Col>
     </Row>
     <br/>
    </div>
  )
}

export default CompanyEdit;
