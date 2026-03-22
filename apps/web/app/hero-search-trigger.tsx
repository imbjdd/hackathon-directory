"use client";

import { Search } from "lucide-react";

import { Kbd, KbdGroup } from "@/components/ui/kbd";

export function HeroSearchTrigger() {
  function openSearch() {
    window.dispatchEvent(new Event("open-command-k-search"));
  }

  return (
    <button
      type="button"
      onClick={openSearch}
      className="mt-4 flex w-full max-w-[420px] items-center justify-between gap-3 rounded-2xl border border-black/12 bg-white px-4 py-3 text-left transition-colors hover:bg-black/[0.02]"
      aria-label="Open hackathon search"
    >
      <div className="flex items-center gap-3">
        <Search className="size-4 shrink-0 text-black/35" aria-hidden="true" />
        <span className="text-[15px] text-black/45">Search hackathons...</span>
      </div>
      <KbdGroup className="shrink-0">
        <Kbd className="text-[14px]">⌘</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </KbdGroup>
    </button>
  );
}
