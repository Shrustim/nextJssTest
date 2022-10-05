import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    
      <div>
        <h1>
          Welcome to <a href="https://nextjs.org">Home Page!</a>
        </h1>
        <Link href="/" >
              <a >Home</a>
            </Link><br/>
            <Link href="/login" >
              <a >Login</a>
            </Link><br/>
            <Link href="/profile" >
              <a >profile</a>
            </Link>
      </div>

      
  )
}

export default Home
