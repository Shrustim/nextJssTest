import type { NextPage } from 'next'
import { Col, Row,Card  } from 'antd';
import SoftwareForm from '../../src/components/SoftwareForm';
const Software: NextPage = () => {
   

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
          <Card title="Add Software" style={{ width: '100%' }}>
              <SoftwareForm id={null}/>
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

export default Software
