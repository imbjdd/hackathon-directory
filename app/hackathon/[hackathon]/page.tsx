import { getData, Hackathon } from '../../page';
import Image from 'next/image';

export default async function HackathonPage({ params }: { params: Promise<{ hackathon: string }> }) {
  const { hackathon: hackathonId } = await params;
  const data: Hackathon[] = await getData();
  const hackathon = data.find((h: Hackathon) => h.id === hackathonId) || null;

  if (!hackathon) {
    return <div className={`min-h-screen bg-[#FAFAFA]`}>Hackathon not found</div>;
  }

  return (
    <div>
      <div className={`min-h-screen bg-[#FAFAFA]`}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-4">{hackathon.name}</h1>
          <p className="text-lg mb-2"><strong>Date:</strong> {hackathon.date}</p>
          <p className="text-lg mb-2"><strong>Location:</strong> {hackathon.location}</p>
          <p className="text-lg mb-2"><strong>Status:</strong> {hackathon.status}</p>
          <p className="text-lg mb-2"><strong>Category:</strong> {hackathon.category}</p>
          <p className="text-lg mb-2"><strong>Prize:</strong> {hackathon.prize}</p>
          <p className="text-lg mb-2"><strong>Website:</strong> <a href={hackathon.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{hackathon.website}</a></p>
        </div>
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