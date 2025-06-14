import Image from 'next/image'
import Link from 'next/link'
import {ReactNode} from 'react'
import logo from "../../public/logo.svg"
import { ToasterClient } from "@/components/ToasterClient";
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const RootLayout = async({children}:{children:ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if(!isUserAuthenticated){
    redirect("/sign-in");
  }
  return (
    <div className='root-layout'>
      <nav>
        <Link href='/' className='flex items-center gap-2'>
        <Image src={logo} alt='logo' width={38} height={32}/>
        <h2 className='text-primary-100'>PrepWise</h2>
        </Link>
      </nav>
      {children}
      <ToasterClient />
    </div>
  )
}

export default RootLayout