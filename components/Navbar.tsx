import React from "react";
import Link from "next/link";
import Image from "next/image";

const NavIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/user.svg", alt: "user" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
];
const Navbar = () => {
  return (
    <header className="w-full ">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            height={27}
            width={27}
            alt="logo"
          />
          <p className="nav-logo">
            price<span className="text-primary">Wise</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {NavIcons.map((icon) => (
            <Image
              key={icon.alt}
              src={icon.src}
              alt="icon.alt"
              width={28}
              height={28}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
