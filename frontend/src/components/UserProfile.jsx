import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UserProfile = () => {
  const { user } = useAuth0();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6">User Profile</h2>
      <img src={user.picture} alt={user.name} className="w-32 h-32 rounded-full mb-4" />
      <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
      <p className="text-gray-600 mb-4">{user.email}</p>
      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold mb-2">User Information</h4>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UserProfile;