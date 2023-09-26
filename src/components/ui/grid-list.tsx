"use client";

import cn from "clsx";

const GridList: React.FCC = ({ children , className}) => {
  return (
    <div className={cn('mb-16 grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-12', className)}>
      {children}
    </div>
  );
};

export default GridList;
