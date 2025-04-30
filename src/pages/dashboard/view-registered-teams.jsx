import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { registrationApi } from "../../lib/api";
import { Users, ChevronLeft, Calendar } from "lucide-react";

const ViewRegisteredTeams = () => {
  const { eventId } = useParams();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await registrationApi.getTeamsByEvent(eventId);
        setTeams(response.data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c7873]"></div>
        <span className="ml-3 text-gray-600">Loading teams...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Button 
            className="bg-[#2c7873] hover:bg-[#1c5853] text-white"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white border border-[#d5efe6] rounded-lg shadow-sm p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#d5efe6] flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-[#2c7873]" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No teams registered for this event</h3>
          <Button 
            className="bg-[#2c7873] hover:bg-[#1c5853] text-white"
            onClick={() => window.history.back()}
          >
            Back to Event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white border border-[#d5efe6] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#d5efe6] flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-[#2c7873]" />
            <h2 className="text-xl font-bold text-black">Registered Teams</h2>
          </div>
          <Badge className="bg-[#2c7873] text-white">{teams.length}</Badge>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className="border border-[#d5efe6] rounded-lg p-4 transition-all hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-black mb-2">{team.name}</h3>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1 text-[#2c7873]" />
                  <p>Created: {new Date(team.created_at).toLocaleDateString()} at {new Date(team.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-[#d5efe6] bg-gray-50 flex justify-end">
          <Button 
            variant="outline" 
            className="border-[#2c7873] text-[#2c7873] hover:bg-[#d5efe6] hover:text-[#2c7873]"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewRegisteredTeams;