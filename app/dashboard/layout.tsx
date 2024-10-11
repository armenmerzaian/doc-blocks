import React from 'react';
import LeftMenu from '@/app/components/LeftMenu';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {



  return (
    <div className="flex">
      <LeftMenu />
      <main className="w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
