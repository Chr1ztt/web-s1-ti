import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../sidebar";
import BaseSidebar from "./baseSidebar";
import { SidebarData } from "@/types/sidebar";
import { Separator } from "../../separator";
import BaseSidebarBreadcrumb from "./baseSidebarBreadcrumb";

const BaseLayoutWithSidebar = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { sidebarData: SidebarData }
>(({ sidebarData, children }, ref) => {
  return (
    <SidebarProvider ref={ref}>
      <BaseSidebar data={sidebarData} />
      <SidebarInset>
        <header className="flex border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BaseSidebarBreadcrumb/>
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
});

export default BaseLayoutWithSidebar;
