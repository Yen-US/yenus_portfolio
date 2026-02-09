"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/resume-data";
import { Github, Linkedin, FileText, Globe, Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function WelcomeCard() {
  return (
    <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <Avatar className="h-32 w-32 border-2 border-white/20 shadow-xl md:h-40 md:w-40">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback>YU</AvatarFallback>
        </Avatar>
      </motion.div>

      <div className="space-y-3 flex-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {profile.name}
          </h1>
          <p className="text-lg text-muted-foreground">{profile.alias}</p>
        </div>

        <p className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          {profile.title}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 md:justify-start">
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
            Azure AI-102
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
            Azure AZ-204
          </Badge>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
            3 promotions in 2 years
          </Badge>
          <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
            5+ years in tech
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-2 md:justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10 transition-transform hover:-translate-y-0.5"
            asChild
          >
            <Link
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener"
              title="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10 transition-transform hover:-translate-y-0.5"
            asChild
          >
            <Link
              href={profile.links.github}
              target="_blank"
              rel="noopener"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10 transition-transform hover:-translate-y-0.5"
            asChild
          >
            <Link
              href={profile.links.website}
              target="_blank"
              rel="noopener"
              title="Website"
            >
              <Globe className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10 transition-transform hover:-translate-y-0.5"
            asChild
          >
            <Link href={`mailto:${profile.email}`} title="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10 transition-transform hover:-translate-y-0.5"
            asChild
          >
            <Link href={profile.links.cv} title="Download CV/Resume">
              <FileText className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
