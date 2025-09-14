import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  Home, 
  Upload, 
  Download,
  Building2,
  LogOut,
  FileDown
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useImportExport } from "@/hooks/useImportExport";
import { useRef } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { importing, exporting, handleExport, handleImport, handleTemplateDownload } = useImportExport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
    }
    // Reset the input
    e.target.value = '';
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "All Leads", href: "/buyers", icon: Users },
    { name: "New Lead", href: "/buyers/new", icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">LeadFlow</span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || 
                  (item.href === "/buyers" && location.pathname.startsWith("/buyers") && location.pathname !== "/buyers/new");
                
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="flex items-center space-x-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
              
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleImportClick}
                  disabled={importing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {importing ? "Importing..." : "Import CSV"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                  disabled={exporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? "Exporting..." : "Export"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleTemplateDownload}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Template
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="sm:hidden flex items-center">
              <Button variant="ghost" size="sm">Menu</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};