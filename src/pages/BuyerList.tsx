import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search,
  Filter,
  Eye,
  Edit2,
  Download,
  Upload,
  Plus,
  FileDown
} from "lucide-react";
import { useBuyers } from "@/hooks/useBuyers";
import { getStatusColor, formatBudget } from "@/lib/demo-data";
import { useImportExport } from "@/hooks/useImportExport";
import type { BuyerFilters } from "@/types/buyer";
import { useRef } from "react";

const ITEMS_PER_PAGE = 10;

export default function BuyerList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
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

  // Get filters from URL
  const filters: BuyerFilters = {
    search: searchParams.get("search") || undefined,
    city: searchParams.get("city") as any || undefined,
    propertyType: searchParams.get("propertyType") as any || undefined,
    status: searchParams.get("status") as any || undefined,
    timeline: searchParams.get("timeline") as any || undefined,
    page: parseInt(searchParams.get("page") || "1"),
  };

  const { buyers, loading } = useBuyers(filters);

  const totalPages = Math.ceil(buyers.length / ITEMS_PER_PAGE);
  const currentPage = filters.page || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBuyers = buyers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const updateFilter = (key: keyof BuyerFilters, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value && value !== "") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    // Reset to page 1 when filters change
    if (key !== "page") {
      newParams.set("page", "1");
    }
    
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", searchInput);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-lg">Loading your leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buyer Leads</h1>
          <p className="text-muted-foreground">
            {buyers.length} leads found
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            variant="outline" 
            size="sm"
            onClick={handleTemplateDownload}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Template
          </Button>
          <Link to="/buyers/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={filters.city || ""} onValueChange={(value) => updateFilter("city", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                <SelectItem value="Mohali">Mohali</SelectItem>
                <SelectItem value="Zirakpur">Zirakpur</SelectItem>
                <SelectItem value="Panchkula">Panchkula</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.propertyType || ""} onValueChange={(value) => updateFilter("propertyType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Plot">Plot</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status || ""} onValueChange={(value) => updateFilter("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Visited">Visited</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.timeline || ""} onValueChange={(value) => updateFilter("timeline", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Timelines</SelectItem>
                <SelectItem value="0-3m">0-3 months</SelectItem>
                <SelectItem value="3-6m">3-6 months</SelectItem>
                <SelectItem value=">6m">&gt;6 months</SelectItem>
                <SelectItem value="Exploring">Exploring</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          {buyers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No leads found.</p>
              <Link to="/buyers/new">
                <Button>Create Your First Lead</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBuyers.map((buyer) => (
                    <TableRow key={buyer.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">
                        <div>
                          <div>{buyer.full_name}</div>
                          {buyer.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {buyer.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {buyer.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{buyer.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{buyer.phone}</div>
                          {buyer.email && (
                            <div className="text-muted-foreground">{buyer.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{buyer.city}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{buyer.property_type}</div>
                          {buyer.bhk && (
                            <div className="text-muted-foreground">{buyer.bhk}BHK</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatBudget(buyer.budget_min, buyer.budget_max)}</div>
                          <div className="text-muted-foreground">{buyer.purpose}</div>
                        </div>
                      </TableCell>
                      <TableCell>{buyer.timeline}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(buyer.status)} variant="secondary">
                          {buyer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(buyer.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/buyers/${buyer.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/buyers/${buyer.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => updateFilter("page", String(currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter("page", String(page))}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => updateFilter("page", String(currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}