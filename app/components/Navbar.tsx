import Link from 'next/link';
import Image from 'next/image';
import { Github } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="bg-[#FAFAFA]">
      <div className='w-full h-fit py-2 bg-[#123192] flex items-center justify-center'>
        <p className='text-white text-sm font-bold'>If you like this project, please give it a <a href="https://github.com/imbjdd/hackathon-directory" target="_blank" rel="noopener noreferrer" className='text-yellow-300'>star on GitHub</a></p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="Hackathons Directory" width={710} height={85} className=' h-8 w-auto' />
        </Link>
        <div className="flex gap-6">
          <Link href="https://github.com/imbjdd/hackathon-directory" target="_blank" rel="noopener noreferrer">
            <Github className='w-8 h-8' />
          </Link>
        </div>
      </header>
    </div>
    </div>
  );
}