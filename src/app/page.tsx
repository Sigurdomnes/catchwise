import type { Metadata } from "next";
import landing from '../public/rb_313.png'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "ESG Generator",
  description: "ESG Generator",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Home() {

  return (
      <div style={{background: '#fff', padding: '5rem', height: 'calc(100vh -  3rem)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1>ESG report generator</h1>
        <Image src={landing} alt="" width={800}/>
        <p>Select or add a new company to start</p>
      </div>
  );
}