import type { SkillCategory } from "@/types/resume";

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: "Frontend",
  languages: "Programming Languages",
  ui_frameworks: "UI Frameworks",
  cms: "CMS",
  build_tools: "Build Tools",
  version_control: "Version Control",
  project_management: "Project Management",
  api_technologies: "API Technologies",
  animations: "Animations",
  mapping: "Mapping",
  backend: "Backend",
  hosting_deployment: "Hosting & Deployment",
  mobile: "Mobile",
  other: "Other",
  soft: "Soft Skills",
};

const CATEGORY_RULES: Array<{ category: SkillCategory; pattern: RegExp }> = [
  { category: "frontend", pattern: /^(react(\.js| native)?|next\.js|angular|vue\.js|expo|cordova)$/i },
  { category: "languages", pattern: /^(javascript|typescript|ruby|html|css|scss|sass)$/i },
  { category: "ui_frameworks", pattern: /^(material ui|bootstrap|tailwind)$/i },
  { category: "cms", pattern: /^(contentful|sitecore|sanity)$/i },
  { category: "build_tools", pattern: /^(webpack|babel|grunt)$/i },
  { category: "version_control", pattern: /^(github|bitbucket|git)$/i },
  { category: "project_management", pattern: /^(jira|confluence)$/i },
  { category: "api_technologies", pattern: /^(rest|graphql|postman|rest apis)$/i },
  { category: "animations", pattern: /^gsap$/i },
  { category: "mapping", pattern: /^mapbox$/i },
  { category: "backend", pattern: /^(node js|node\.js|express|fastify)$/i },
  { category: "hosting_deployment", pattern: /^(vercel|netlify|serverless)$/i },
  { category: "mobile", pattern: /^(react native|expo|cordova)$/i },
  { category: "soft", pattern: /^(agile|scrum|leadership|communication|teamwork)$/i },
];

export function categorizeSkill(name: string): SkillCategory {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(name.trim())) {
      return rule.category;
    }
  }

  return "other";
}

export const CORE_EXPERTISE_KEYWORDS = [
  "Frontend Development",
  "UI Engineering",
  "React.js",
  "Next.js",
  "Performance Optimization",
  "Accessibility",
  "Scalable Web Applications",
];
