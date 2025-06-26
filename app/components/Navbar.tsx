import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-medium"><Link href="/">Hackathons Directory</Link></h1>
        <div className="flex gap-6">
          <iframe 
            src="https://ghbtns.com/github-btn.html?user=imbjdd&repo=hackathon-directory&type=star&count=true&size=large" 
            frameBorder="0" 
            scrolling="0" 
            width="170" 
            height="30" 
            title="GitHub"
          />
        </div>
      </header>
    </div>
    <div className="relative w-full h-40 overflow-hidden">
        <Image 
          src="/bg.webp" 
          alt="Hackathons Banner" 
          fill 
          style={{ objectFit: 'cover' }} 
          className="brightness-[0.85]"
        />
      </div>
    </div>
  );
} 