import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../breadcrumb";
import { Link, useLocation, useRouterState } from "@tanstack/react-router";

const BaseSidebarBreadcrumb = () => {
  const matches = useRouterState({ select: (s) => s.matches });
  const { pathname } = useLocation();

  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  console.log("pathname: ", pathname);

  const breadcrumbs: { title: string; path: string }[] = [];
  for (const match of matches) {
    if (breadcrumbs.some((b) => b.title === match.context.title)) {
      continue;
    }

    const normalizedPathname =
      match.pathname.endsWith("/") && match.pathname !== "/"
        ? match.pathname.slice(0, -1)
        : match.pathname;

    breadcrumbs.push({
      title: match.context.title,
      path: normalizedPathname,
    });
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {breadcrumb.path === normalizedPathname ? (
                <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BaseSidebarBreadcrumb;
