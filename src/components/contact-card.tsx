"use client";

import { profile } from "@/lib/resume-data";
import { Github, Linkedin, MapPin, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ContactCard() {
  const links = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: profile.links.linkedin,
      color: "hover:text-blue-500",
    },
    {
      icon: Github,
      label: "GitHub",
      href: profile.links.github,
      color: "hover:text-white",
    },
    {
      icon: FileText,
      label: "Download CV",
      href: profile.links.cv,
      color: "hover:text-green-500",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Get in Touch</h2>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{profile.location}</span>
      </div>

      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <motion.div
            key={link.label}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener" : undefined}
              className={`flex items-center gap-2 text-sm text-muted-foreground transition-colors ${link.color}`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
