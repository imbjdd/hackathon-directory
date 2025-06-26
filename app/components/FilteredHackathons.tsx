"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

type Hackathon = {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  prize: string;
  website: string;
};

export default function FilteredHackathons({ hackathons }: { hackathons: Hackathon[] }) {
  const [filter, setFilter] = useState('upcoming');
  
  // Helper function to determine if a hackathon is upcoming based on its date
  const isUpcoming = (date: string): boolean => {
    // Parse the date string - expecting formats like "May 23-25, 2025" or "October 10-31, 2025"
    const dateParts = date.split(',');
    if (dateParts.length < 2) return false;
    
    // Extract the year which should be the last part after trimming
    const year = parseInt(dateParts[dateParts.length - 1].trim());
    
    // Extract the month from the first part
    const monthStr = date.split(' ')[0];
    
    // Convert month name to month number (0-11)
    const months: Record<string, number> = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    const month = months[monthStr];
    
    // Extract the day - take the first number in case of ranges like "23-25"
    const dayMatch = date.match(/\d+/);
    const day = dayMatch ? parseInt(dayMatch[0]) : 1;
    
    // Create date objects for the hackathon date and current date
    const hackathonDate = new Date(year, month, day);
    const currentDate = new Date();
    
    // Set times to beginning of day for fair comparison
    hackathonDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    // Return true if hackathon date is in the future
    return hackathonDate >= currentDate;
  };

  // Filter hackathons based on the filter state and calculated status
  const filteredHackathons = filter === 'all' 
    ? hackathons
    : filter === 'upcoming'
    ? hackathons.filter(hackathon => isUpcoming(hackathon.date))
    : hackathons.filter(hackathon => !isUpcoming(hackathon.date));

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 text-sm rounded-full ${
            filter === 'upcoming' 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
          } transition-colors`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setFilter('past')}
          className={`px-4 py-2 text-sm rounded-full ${
            filter === 'past' 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
          } transition-colors`}
        >
          Past
        </button>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100">
              <TableHead className="font-medium text-gray-500 text-sm py-4">Event</TableHead>
              <TableHead className="font-medium text-gray-500 text-sm py-4">Date</TableHead>
              <TableHead className="font-medium text-gray-500 text-sm py-4">Location</TableHead>
              <TableHead className="font-medium text-gray-500 text-sm py-4">Category</TableHead>
              <TableHead className="font-medium text-gray-500 text-sm py-4">Prize</TableHead>
              <TableHead className="font-medium text-gray-500 text-sm py-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHackathons.map((hackathon) => {
              // Determine if the hackathon is upcoming
              const upcoming = isUpcoming(hackathon.date);
              // Set status text based on whether it's upcoming
              const status = upcoming ? "Upcoming" : "Completed";
              
              return (
                <TableRow 
                  key={hackathon.id} 
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-4 font-medium">
                    <a 
                      href={hackathon.website}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="hover:underline"
                    >
                      {hackathon.name}
                    </a>
                  </TableCell>
                  <TableCell className="py-4 text-gray-500">{hackathon.date}</TableCell>
                  <TableCell className="py-4 text-gray-500">{hackathon.location}</TableCell>
                  <TableCell className="py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {hackathon.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-gray-500">{hackathon.prize}</TableCell>
                  <TableCell className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      status === "Upcoming"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {status}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
} 