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
  status: string;
  category: string;
  prize: string;
  website: string;
};

export default function FilteredHackathons({ hackathons }: { hackathons: Hackathon[] }) {
  const [filter, setFilter] = useState('all');
  
  // Filter hackathons based on the filter state
  const filteredHackathons = filter === 'all' 
    ? hackathons
    : filter === 'upcoming'
    ? hackathons.filter(hackathon => hackathon.status === 'Upcoming')
    : hackathons.filter(hackathon => hackathon.status === 'Completed');

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-8">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm rounded-full ${
            filter === 'all' 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
          } transition-colors`}
        >
          All events
        </button>
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
            {filteredHackathons.map((hackathon) => (
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
                    hackathon.status === "Open" 
                      ? "bg-green-100 text-green-800" 
                      : hackathon.status === "Completed"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {hackathon.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
} 