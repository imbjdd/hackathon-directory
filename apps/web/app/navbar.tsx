import Link from "next/link";

const navButtonClassName =
  "inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1";

export function Navbar() {
  return (
    <nav className="relative z-[10000] flex items-center px-[100px] py-[35px] text-base font-medium leading-5 max-[1024px]:px-10 max-[1024px]:py-6 max-[640px]:px-4 max-[640px]:py-[18px]">
      <Link href="/" className="font-[family-name:var(--font-inter)]">
        Hackathon Atlas
      </Link>

      <div className="absolute left-1/2 z-[10001] flex -translate-x-1/2 items-center gap-1">
        <Link href="/explore-hackathons" className={navButtonClassName}>
          Explore Hackathons
        </Link>

        <Link href="/about" className={navButtonClassName}>
          About
        </Link>
      </div>
    </nav>
  );
}
