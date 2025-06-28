import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="bg-[#FAFAFA]">
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
    </div>
  );
}