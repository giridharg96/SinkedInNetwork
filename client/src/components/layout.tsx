import { Link } from "wouter";
import { Building2, Home, User } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Building2 className="h-6 w-6" />
            <span className="hidden sm:inline">SinkedIn</span>
          </Link>

          <nav className="flex flex-1 items-center justify-end space-x-2">
            <Link href="/">
              <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Home className="h-4 w-4 mr-2" />
                Home
              </a>
            </Link>
            <Link href="/profile">
              <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <User className="h-4 w-4 mr-2" />
                Profile
              </a>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container max-w-screen-md py-6">{children}</main>
    </div>
  );
}
