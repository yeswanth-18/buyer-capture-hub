import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Building2
} from "lucide-react";
import { demoBuyers, getStatusColor } from "@/lib/demo-data";

export default function Dashboard() {
  // Calculate stats from demo data
  const stats = {
    total: demoBuyers.length,
    new: demoBuyers.filter(b => b.status === "New").length,
    qualified: demoBuyers.filter(b => b.status === "Qualified").length,
    converted: demoBuyers.filter(b => b.status === "Converted").length,
    dropped: demoBuyers.filter(b => b.status === "Dropped").length,
  };

  const recentLeads = demoBuyers
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Lead Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your buyer leads efficiently
          </p>
        </div>
        <Link to="/buyers/new">
          <Button className="flex items-center gap-2" size="lg">
            <UserPlus className="h-5 w-5" />
            Add New Lead
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-md transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.qualified}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.converted}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dropped</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.dropped}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link to="/buyers">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((buyer) => (
                <div key={buyer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-smooth">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{buyer.fullName}</h4>
                      <Badge className={getStatusColor(buyer.status)} variant="secondary">
                        {buyer.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {buyer.phone} • {buyer.city} • {buyer.propertyType}
                      {buyer.bhk && ` - ${buyer.bhk}BHK`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{buyer.purpose}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(buyer.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link to="/buyers/new">
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Lead
              </Button>
            </Link>
            <Link to="/buyers?status=New">
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                View New Leads
              </Button>
            </Link>
            <Link to="/buyers?status=Qualified">
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                View Qualified
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Import CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}