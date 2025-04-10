import { Cross as Progress } from 'lucide-react';

function ProfileProgress({ user }) {
  const calculateProgress = () => {
    const fields = ['name', 'email', 'gender', 'stream', 'date_of_birth', 'passing_out_year'];
    const completedFields = fields.filter(field => user && user[field]);
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">{progress}% complete</p>
    </div>
  );
}

export default ProfileProgress;