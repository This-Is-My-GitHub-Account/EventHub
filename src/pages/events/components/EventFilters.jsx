import { useState } from 'react';

function EventFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    eventType: '',
    department: '',
    participationType: '',
  });

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Type</label>
        <select
          name="eventType"
          value={filters.eventType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Online">Online</option>
          <option value="In Person">In Person</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <select
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          <option value="Computer Engineering">Computer Engineering</option>
          <option value="Electronics">Electronics</option>
          <option value="Civil Engineering">Civil Engineering</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Participation Type</label>
        <select
          name="participationType"
          value={filters.participationType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Solo">Solo</option>
          <option value="Team">Team</option>
        </select>
      </div>
    </div>
  );
}

export default EventFilters;