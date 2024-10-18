import React from 'react';
import LeftMenu from '@/components/sidebar/left-menu';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {



  return (
    <div className="flex dark:bg-black">
      <LeftMenu />
      <main className="w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
