import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfileCompletion({ user }) {
  // Default user data if not provided
  const userData = user || {
    name: "John Doe",
    email: "john.doe@example.com",
    gender: "Male",
    stream: "Computer Engineering",
    dateOfBirth: "2000-05-15",
    passingOutYear: "2024",
    phoneNumber: null,
    collegeId: null,
    address: null,
    profilePicture: null,
  }

  // Calculate profile completion percentage
  const calculateCompletion = (userData) => {
    const requiredFields = [
      "name",
      "email",
      "gender",
      "stream",
      "dateOfBirth",
      "passingOutYear",
      "phoneNumber",
      "collegeId",
      "address",
      "profilePicture",
    ]

    const completedFields = requiredFields.filter(
      (field) => userData[field] !== null && userData[field] !== undefined && userData[field] !== "",
    )

    return Math.round((completedFields.length / requiredFields.length) * 100)
  }

  const completionPercentage = calculateCompletion(userData)

  // Get missing fields
  const getMissingFields = (userData) => {
    const missingFields = []
    if (!userData.phoneNumber) missingFields.push("Phone Number")
    if (!userData.collegeId) missingFields.push("College ID")
    if (!userData.address) missingFields.push("Address")
    if (!userData.profilePicture) missingFields.push("Profile Picture")

    return missingFields
  }

  const missingFields = getMissingFields(userData)

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-semibold text-lg mb-3">Profile Completion</h3>

      <div className="mb-2 flex justify-between items-center">
        <span className="text-sm text-gray-600">Overall completion</span>
        <span className="font-medium">{completionPercentage}%</span>
      </div>

      <Progress value={completionPercentage} className="h-2 mb-4" />

      {completionPercentage < 100 && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please complete your profile to get full access to all features.
            {missingFields.length > 0 && (
              <div className="mt-2">
                <span className="font-medium">Missing information:</span>
                <ul className="list-disc list-inside text-sm mt-1">
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
