const ProfileCard = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <div className="flex items-center gap-4">
        <img src="/images/Logo.png" alt="Logo" className="w-10 h-10" />
        <div>
          <h2 className="font-semibold">AATI</h2>
          <p className="text-sm text-gray-500">Kenya</p> 
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div>
          <p className="text-xl font-bold">38</p>
          <p className="text-xs text-gray-500">Courses</p>
        </div>
        <div>
          <p className="text-xl font-bold">12</p>
          <p className="text-xs text-gray-500">Certifications</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
