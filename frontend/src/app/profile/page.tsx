import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/api/auth/login');
  }
  
  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.username}</p>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
} 