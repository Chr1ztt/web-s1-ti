import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../sidebar";
import BaseSidebar from "./baseSidebar";
import { SidebarData } from "@/interfaces/sidebar.interface";
import { Separator } from "../../separator";
import BaseSidebarBreadcrumb from "./baseSidebarBreadcrumb";
import ThemeToggleButton from "@/features/shared/components/themeToggleButton";

const BaseLayoutWithSidebar = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { sidebarData: SidebarData }
>(({ sidebarData, children }, ref) => {
  return (
    <SidebarProvider ref={ref}>
      <BaseSidebar data={sidebarData} />
      <SidebarInset>
        <header className="sticky top-0 bg-background z-10 flex border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BaseSidebarBreadcrumb />
            <ThemeToggleButton className="ms-auto" />
          </div>
        </header>
        <div className="p-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
});

export default BaseLayoutWithSidebar;
