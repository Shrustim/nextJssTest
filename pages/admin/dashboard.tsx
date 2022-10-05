import type { NextPage } from 'next'
import Link from 'next/link'

const Dashboard: NextPage = () => {
  return (
    
      <div>
        <h1>
          Welcome to Dashboard
        </h1>
        <Link href="/admin/users" >
              <a >users</a>
            </Link><br/>
            <Link href="/admin/companies" >
              <a >companies</a>
            </Link><br/>
            <Link href="/admin/softwares" >
              <a >softwares</a>
            </Link>
      </div>

      
  )
}

export default Dashboard
