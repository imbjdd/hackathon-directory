import { getData, Hackathon } from '../../page';
import Image from 'next/image';
import { Calendar } from "@/components/ui/calendar"
import { PrizeScale } from '@/app/components/PrizeScale';

// Utilitaire pour parser une string de range type 'July 4-6, 2025' en { from, to }
function parseDateRange(dateStr: string): { from: Date, to: Date } | null {
  // Ex: 'July 4-6, 2025' ou 'July 4, 2025'
  const rangeRegex = /^(\w+) (\d+)(?:-(\d+))?, (\d{4})$/;
  const match = dateStr.match(rangeRegex);
  if (!match) return null;
  const [, month, startDay, endDay, year] = match;
  const monthIndex = new Date(`${month} 1, 2000`).getMonth();
  const from = new Date(Number(year), monthIndex, Number(startDay));
  const to = endDay ? new Date(Number(year), monthIndex, Number(endDay)) : from;
  return { from, to };
}

export default async function HackathonPage({ params }: { params: Promise<{ hackathon: string }> }) {
  const { hackathon: hackathonId } = await params;
  const data: Hackathon[] = await getData();
  const hackathon = data.find((h: Hackathon) => h.id === hackathonId) || null;

  if (!hackathon) {
    return <div className={`min-h-screen bg-[#FAFAFA] flex items-center justify-center`}><div className="text-2xl font-semibold text-gray-500">Hackathon not found</div></div>;
  }

  const range = parseDateRange(hackathon.date) || undefined;

  return (
    <div className="bg-[#FAFAFA] flex flex-col">
      <div className="relative w-full h-40">
        <Image 
          src="/bg.webp" 
          alt="Hackathons Banner" 
          fill 
          style={{ objectFit: 'cover' }} 
          className="brightness-[0.7]"
        />
        <div className='absolute h-fit bottom-0 translate-y-1/2 w-full flex items-center justify-center'>
          <div className='max-w-5xl w-full mx-auto'>
            <div className="bg-[#FAFAFA] rounded-lg w-fit z-10 text-black bg-gradient-to-t px-6 py-4 flex items-center">
              <h1 className="text-3xl">{hackathon.name}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-12 max-w-5xl mx-auto space-y-3 px-6 pt-16 justify-between">
        <div className='flex grow flex-col gap-4'>
          <p className="text-lg"><strong>Location :</strong> {hackathon.location}</p>
          <span className="px-2 py-1 mb-6 text-sm w-fit font-semibold bg-pink-300 text-black border-2 border-black rounded-full">{hackathon.category}</span>
          <PrizeScale prize={hackathon.prize} />
          
          <a href={hackathon.website}
          target="_blank" rel="noopener noreferrer" className="px-4 w-fit py-2 bg-black text-white rounded-full">
            Visit website
          </a>
        </div>
        <Calendar
          mode="range"
          selected={range}
          month={range?.from}
          className="rounded-md border shadow-sm"
          captionLayout="dropdown"
        />
      </div>
      
    </div>
  );
}