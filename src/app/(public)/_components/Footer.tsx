import { LucideIcon, Mail, Phone } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";
import { FooterNavLinks } from "./NavLinks";
import { ReactNode } from "react";

export type Contact = {
  label: string;
  icon: LucideIcon;
};

export type SocialLink = {
  icon: ReactNode;
  href: string;
};

export type UtilLink = {
  label: string;
  href: string;
};

const contacts: Contact[] = [
  { label: "kiass@kesmonds.edu.cm", icon: Mail },
  {
    label: "admission@kesmonds.edu.cm",
    icon: Mail,
  },
  {
    label: "(+237) 654 23",
    icon: Phone,
  },
];

const socialLinks: SocialLink[] = [
  { icon: <FaFacebookF className="text-primary" />, href: "" },
];

const utilsLink: UtilLink[] = [
  {
    href: "https://kesmonds.edu.cm/",
    label: "site officel de KIU",
  },
  {
    href: "",
    label: "MINESUP",
  },
  {
    href: "",
    label: "Université de Ngoundere",
  },
  {
    href: "https://greenhopeuniversity.net/",
    label: "Green Hope International University",
  },
];

export function Footer() {
  return (
    <footer className="py-4 px-10 flex justify-center items-center   bg-primary/10 w-full md:h-100 text-lg">
      <div className="max-w-7xl flex flex-col gap-8 md:flex-row items-baseline justify-around">
        <div className="w-full flex flex-col gap-5">
          <div>KESMOND</div>
          <div className="text-base text-zinc-400">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ icon: Icon, href }, index) => (
              <Link
                className="rounded-full p-2 bg-primary/20 text-primary"
                href={href}
                key={index}
              >
                {Icon}
              </Link>
            ))}
          </div>
        </div>
        {/* utils link */}
        <div className="w-full flex flex-col gap-5">
          <h1 className="font-bold">Lien utile</h1>
          <ul className="flex flex-col gap-4">
            {utilsLink.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="flex gap-2 text-primary hover:text-primary/80"
                  key={link.label}
                >
                  {/* <Icon size={20} className="text-secondary" /> */}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Nav links  */}
        <div className="w-full space-y-4">
          <h1 className="font-bold">Navigation</h1>
          <FooterNavLinks />
        </div>
        {/* contacts  */}
        <div className="w-full md:w-auto space-y-4">
          <div className="font-bold space-y-4">Contacts</div>
          <div className="flex flex-col gap-2">
            {contacts.map(({ label, icon: Icon }, index) => (
              <div
                className="flex items-center gap-2 hover:text-primary/80"
                key={index}
              >
                {<Icon size={20} className="text-secondary" />}
                <p className="text-lg text-primary"> {label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
