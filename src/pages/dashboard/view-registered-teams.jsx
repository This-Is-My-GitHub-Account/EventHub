import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { registrationApi } from "../../lib/api";

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
        console.log(response.data[0])
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
    return <div className="text-center py-8">Loading teams...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No teams registered for this event</h3>
        <p className="text-gray-500 mb-6">Be the first to register a team!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-bold mb-4">Registered Teams</h2>
      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
            <Badge className="bg-blue-500">Leader: {team.leader_id}</Badge>
            <ul className="mt-2 space-y-1">
              {team.members.map((member) => (
                <li key={member.id} className="text-sm">
                  <span className="font-medium">{member.name}</span>
                  <span className="text-gray-500 ml-2">{member.email}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default ViewRegisteredTeams;