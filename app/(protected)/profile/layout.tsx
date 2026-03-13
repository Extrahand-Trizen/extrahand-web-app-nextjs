import { ProfileDataPrefetcher } from '@/components/profile/ProfileDataPrefetcher';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProfileDataPrefetcher />
      {children}
    </>
  );
}
