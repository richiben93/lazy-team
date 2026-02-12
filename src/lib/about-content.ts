import fs from 'fs';
import path from 'path';
import { AboutContent } from '@/types';

const dataDirectory = path.join(process.cwd(), 'public/data');
const aboutFile = path.join(dataDirectory, 'about.json');

export function getAboutContent(): AboutContent {
  if (!fs.existsSync(aboutFile)) {
    // Default content if file doesn't exist
    return {
      title: "The Story",
      subtitle: "We ride because it's hard.",
      description: `Lazy Team was born from a simple idea: that the best way to see the world is at 25 kilometers per hour. We aren't professional athletes, but we treat every climb like a world championship.

Founded in 2023, what started as a few friends meeting for Sunday coffee rides evolved into an obsession with exploring the most challenging and beautiful terrain we could find.

Our philosophy is simple: Ride long, eat well, and never take yourself too seriously. The "Lazy" in our name is ironic—or maybe it's a reflection of how we feel after a 2,000-meter climb.`,
      image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=2000",
      values: [
        {
          title: "Exploration",
          description: "We seek out the roads less traveled, the steepest gradients, and the most rewarding views."
        },
        {
          title: "Community",
          description: "Cycling is better together. We support each other through every mechanical and every bonk."
        },
        {
          title: "Storytelling",
          description: "Every ride is an adventure worth documenting. We share our stories to inspire others to get out and ride."
        }
      ]
    };
  }
  
  const fileContents = fs.readFileSync(aboutFile, 'utf8');
  return JSON.parse(fileContents);
}

export function saveAboutContent(content: AboutContent) {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
  fs.writeFileSync(aboutFile, JSON.stringify(content, null, 2));
}