"use client";

import React from 'react';

import { SheetClose } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
    const pathname = usePathname();
    const userId = 1;

    return (

        <>
            {sidebarLinks.map((items) => {
                const isActive = (pathname.includes(items.route) && items.route.length > 1)
                    || pathname === items.route;

                if (items.route === "/profile") {
                    if (userId) items.route = `${items.route}/${userId}`;
                    else return null;
                }

                const LinkComponent = (
                    <Link
                        href={items.route}
                        key={items.label}
                        className={cn(
                            isActive ? 'primary-gradient rounded-lg text-light-900' : 'text-dark100_light900',
                            "flex justify-start items-center gap-4 bg-transparent p-4"
                        )} >
                        <Image
                            className={cn(
                                { "invert-colors": !isActive }
                            )}
                            src={items.imgURL}
                            height={20}
                            width={20}
                            alt={items.label}
                        />
                        <p className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>
                            {items.label}
                        </p>
                    </Link>
                );
                return isMobileNav ? (
                    <SheetClose asChild key={items.route}>
                        {LinkComponent}
                    </SheetClose>
                ) : (
                    <React.Fragment key={items.route}>
                        {LinkComponent}
                    </React.Fragment>
                );
            })}
        </>
    )
}

export default NavLinks