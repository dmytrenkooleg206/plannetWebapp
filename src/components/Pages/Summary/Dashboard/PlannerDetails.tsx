import Image from 'next/image';

export default function PlannerDetails({ tripPlanner }: any) {
  return (
    <div className="flex flex-row items-center gap-2 my-4 text-sm">
      <div className="flex flex-col w-1/4">
        <Image
          className="border border-2 border-white rounded"
          src={
            tripPlanner.profilePictureUrl ||
            '/assets/images/summary/loadingProfile.png'
          }
          width={150}
          height={150}
          alt="profile"
        />
      </div>
      <div className="flex flex-col w-3/4">{tripPlanner.bio}</div>
    </div>
  );
}
