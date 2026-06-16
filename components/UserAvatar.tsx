import Image from "next/image";
import Link from 'next/link';
import { Avatar, AvatarFallback } from "./ui/avatar";
import ROUTES from '@/constants/routes';
import { cn } from "@/lib/utils";

interface Props {
    id: string;
    name: string;
    imageUrl?: string | null;
    className?: string;
    fallbackClassName?: string;
}

const UserAvatar = ({ id, name, imageUrl, className = "h-9 w-9", fallbackClassName }: Props) => {
    const initials = name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Link href={ROUTES.PROFILE(id)} >
            <Avatar className={`rounded-full overflow-hidden ${className}`}>
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        className="object-cover"
                        width={36}
                        height={36}
                        quality={100}
                    // for dev testing only: 
                    // unoptimized
                    />
                ) : (
                    <AvatarFallback className={cn(
                        "primary-gradient font-space-grotesk font-bold tracking-wider text-white",
                        fallbackClassName
                    )}>
                        {initials}
                    </AvatarFallback>
                )}
            </Avatar>
        </Link >
    )
}

export default UserAvatar