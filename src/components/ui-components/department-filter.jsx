"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function DepartmentFilter({ onSelect }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  // Sample departments
  const departments = [
    { id: "all", name: "All Departments" },
    { id: "computer", name: "Computer Engineering" },
    { id: "electronics", name: "Electronics & Telecommunication" },
    { id: "civil", name: "Civil Engineering" },
    { id: "mechanical", name: "Mechanical Engineering" },
    { id: "electrical", name: "Electrical Engineering" },
    { id: "it", name: "Information Technology" },
    { id: "chemical", name: "Chemical Engineering" },
  ]

  const handleSelect = (departmentId) => {
    setSelectedDepartment(departmentId)
    if (onSelect) {
      onSelect(departmentId)
    }
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-2 p-1">
        {departments.map((department) => (
          <Badge
            key={department.id}
            variant={selectedDepartment === department.id ? "default" : "outline"}
            className={`py-2 px-3 cursor-pointer whitespace-nowrap ${
              selectedDepartment === department.id ? "" : "hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => handleSelect(department.id)}
          >
            {department.name}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
