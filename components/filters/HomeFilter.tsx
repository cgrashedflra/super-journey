"use client";

import { useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url';

const filters = [
    { name: "React", value: "react" },
    { name: "Javascript", value: "javascript" },
    // { name: "All", value: "all" },
    // { name: "Newest", value: "newest" },
    // { name: "Most viwed", value: "Most viwed" },
    // { name: "Popular", value: "popular" },
    // { name: "Trending", value: "trending" },
];


const HomeFilter = () => {
    const searchParams = useSearchParams();
    const filterParams = searchParams.get("filter");
    const [active, setActive] = useState(filterParams || "");
    const router = useRouter();

    const handleTypeClick = (filter: string) => {
        let newUrl = ""

        if (filter === active) {
            setActive("")
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["filter"],
            });
        } else {
            setActive(filter)
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: filter.toLowerCase(),
            });
        }
        router.push(newUrl, { scroll: false })
    }

    return (
        <div>
            {filters.map((filter) => (
                <Button
                    key={filter.name}
                    className={cn(
                        `body-medium rounded-lg mt-2 mx-1 px-6 py-3 capitalize shadow-none`,
                        active === filter.value
                            ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
                            : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
                    )}
                    onClick={() => handleTypeClick(filter.value)}
                >
                    {filter.name}
                </Button>)
            )
            }

        </div >
    )
}

export default HomeFilter
