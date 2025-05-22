import { Inter } from "next/font/google";
import Image from "next/image";
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import FilteredHackathons from './components/FilteredHackathons';

// Définition de la police
const inter = Inter({ subsets: ["latin"] });

// Define the Hackathon type
type Hackathon = {
  id: string;
  name: string;
  date: string;
  location: string;
  status: string;
  category: string;
  prize: string;
  website: string;
};

// Fonction pour charger les données YAML
async function getData(): Promise<Hackathon[]> {
  const filePath = path.join(process.cwd(), 'data', 'hackathons.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  try {
    const data = yaml.load(fileContents) as Hackathon[];
    
    // Function to extract the start date from a date string
    const getStartDate = (dateStr: string): Date => {
      // Handle different date formats
      // Format examples: "May 23-25, 2025", "May 30 - June 30, 2025", "July 4-7, 2025"
      const months: Record<string, number> = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
        'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
      };
      
      // Extract the first month and day
      const parts = dateStr.split(/[-–]/)[0].trim().split(' ');
      const month = months[parts[0]];
      const day = parseInt(parts[1], 10);
      let year = 2025; // Default year
      
      // Try to extract year if present in the first part
      const yearMatch = parts.join(' ').match(/\b(20\d{2})\b/);
      if (yearMatch) {
        year = parseInt(yearMatch[1], 10);
      }
      
      return new Date(year, month, day);
    };
    
    // Sort hackathons by start date (ascending)
    return data.sort((a, b) => {
      const dateA = getStartDate(a.date);
      const dateB = getStartDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Home() {
  // Charger les données depuis le fichier YAML
  const hackathons = await getData();

  return (
    <div className={`min-h-screen bg-[#FAFAFA] ${inter.className}`}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-medium">Hackathons Directory</h1>
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

      <div className="max-w-5xl mx-auto px-6 py-12">       
        {/* Main content */}
        <main>
          <div className="mb-10">
            <h2 className="text-3xl font-medium mb-3">Browse events</h2>
            <p className="text-gray-500 max-w-2xl">
              Discover <span className="font-bold">{hackathons.length}</span> hackathons from around the world and find opportunities to learn, build, and connect with other developers.
            </p>
          </div>
          
          {/* Client component for filtering */}
          <FilteredHackathons hackathons={hackathons} />

          <p className="text-gray-500 text-sm mt-10">Made with ❤️ by <a href="https://www.linkedin.com/in/salim-boujaddi/" target="_blank" rel="noopener noreferrer">Salim</a> in Paris 🥖</p>
        </main>
      </div>
    </div>
  );
}
