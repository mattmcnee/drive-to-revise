"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import NotFoundSceen from '@/components/ui/NotFoundScreen';
import { useAuth } from '@/firebase/useAuth';
import { getPermissionLevel } from '@/firebase/firestoreInterface';

const AdminPanelPage = () => {
  const { user, loading } = useAuth();
  const [permissionLevel, setPermissionLevel] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getPermissionLevel(user.uid).then((permissionLevel) => {
        setPermissionLevel(permissionLevel);
        console.log(permissionLevel);
      });
    }
  }, [user, loading]);

  if (loading || !user || permissionLevel !== 'admin') {
    return (
      <div>
        <Navbar />
        <NotFoundSceen />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <p>Welcome to the admin panel.</p>
    </div>
  );
};

export default AdminPanelPage;