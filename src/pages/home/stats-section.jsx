import { Trophy, Users, Calendar, Award } from "lucide-react";

export default function StatsSection() {
  // Theme colors - matching the department events component
  const colors = {
    primary: "#2c7873", // Teal for primary actions
    primaryLight: "#d5efe6", // Light mint green for backgrounds
    secondary: "#fde8e6", // Soft pink for secondary elements
    textPrimary: "#000000", // Black for primary text
  };

  const stats = [
    {
      id: 1,
      title: "Events",
      value: "200+",
      icon: <Calendar className="h-8 w-8" style={{ color: colors.primary }} />,
      description: "Organized annually",
    },
    {
      id: 2,
      title: "Participants",
      value: "5,000+",
      icon: <Users className="h-8 w-8" style={{ color: colors.primary }} />,
      description: "From various colleges",
    },
    {
      id: 3,
      title: "Prizes",
      value: "₹10L+",
      icon: <Trophy className="h-8 w-8" style={{ color: colors.primary }} />,
      description: "In cash prizes",
    },
    {
      id: 4,
      title: "Departments",
      value: "12+",
      icon: <Award className="h-8 w-8" style={{ color: colors.primary }} />,
      description: "Participating actively",
    },
  ];

  return (
    <div className="py-16" style={{ backgroundColor: colors.primaryLight }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>
            Why Choose EventHub?
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Join thousands of students in discovering and participating in exciting events across all engineering
            departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div className="flex justify-center mb-4">
                <div 
                  className="p-3 rounded-full" 
                  style={{ backgroundColor: colors.primaryLight }}
                >
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
                {stat.value}
              </h3>
              <p className="font-medium text-gray-800">{stat.title}</p>
              <p className="text-sm text-gray-600 mt-2">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}