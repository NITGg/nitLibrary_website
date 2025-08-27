import clsx from "clsx";
import {
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YouTubeIcon,
  LinkedInIcon,
} from "../ui/icons";

const socialLinks = [
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/",
    label: "Instagram",
  },
  // {
  //   icon: SnapchatIcon,
  //   href: "https://www.snapchat.com/",
  //   label: "Snapchat",
  // },
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/",
    label: "Facebook",
  },
  // {
  //   icon: TikTokIcon,
  //   href: "https://www.tiktok.com/",
  //   label: "TikTok",
  // },
  {
    icon: XIcon,
    href: "https://x.com/",
    label: "X",
  },
  {
    icon: YouTubeIcon,
    href: "https://www.youtube.com/",
    label: "YouTube",
  },
  {
    icon: LinkedInIcon,
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
  },
  // {
  //   icon: WhatsAppIcon,
  //   href: "https://www.whatsapp.com/",
  //   label: "WhatsApp",
  // },
  // {
  //   icon: GoogleIcon,
  //   href: "https://www.google.com/",
  //   label: "Google",
  // },
];

const SocialLinks = ({
  darkMode = false,
  iconsClassName,
}: {
  darkMode?: boolean;
  iconsClassName?: string;
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          className={clsx(
            "hover:opacity-80 transition-opacity p-2 rounded-full drop-shadow-lg",
            darkMode && "bg-[#161C28] text-white",
            !darkMode &&
              "bg-[radial-gradient(97.57%_210.75%_at_0.9%_2.98%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.2)_100%)]"
          )}
          aria-label={link.label}
        >
          <link.icon className={clsx("size-5", iconsClassName)} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
