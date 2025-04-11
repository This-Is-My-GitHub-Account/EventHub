import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function EventFilters({ onFilterChange, departments, eventTypes }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    department: searchParams.get("department") || "all",
    status: searchParams.get("status") || "all",
    type: searchParams.get("type") || "all",
    sortBy: searchParams.get("sortBy") || "date",
  });

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
    
    // Update URL search params
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-[#d5efe6]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-[#2c7873] mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="w-full rounded-md border border-[#d5efe6] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c7873] text-black bg-white"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Department Filter */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-[#2c7873] mb-1">
            Department
          </label>
          <select
            id="department"
            className="w-full rounded-md border border-[#d5efe6] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c7873] text-black bg-white"
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.name} value={dept.name.toLowerCase().replace(/\s+/g, '-')}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-[#2c7873] mb-1">
            Status
          </label>
          <select
            id="status"
            className="w-full rounded-md border border-[#d5efe6] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c7873] text-black bg-white"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Event Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[#2c7873] mb-1">
            Event Type
          </label>
          <select
            id="type"
            className="w-full rounded-md border border-[#d5efe6] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c7873] text-black bg-white"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="all">All Types</option>
            {eventTypes.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-[#2c7873] mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            className="w-full rounded-md border border-[#d5efe6] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#2c7873] text-black bg-white"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="date">Date (Ascending)</option>
            <option value="date-desc">Date (Descending)</option>
            <option value="registrations">Registrations</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
}