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
  database: "Databases",
  hosting_deployment: "Hosting & Deployment",
  mobile: "Mobile",
  other: "Other",
  soft: "Soft Skills",
};

/** Display order for skills in preview and editor */
export const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  "frontend",
  "languages",
  "ui_frameworks",
  "cms",
  "build_tools",
  "version_control",
  "project_management",
  "api_technologies",
  "animations",
  "mapping",
  "backend",
  "database",
  "hosting_deployment",
  "mobile",
  "soft",
  "other",
];

export function groupSkillsByCategory<T extends { category: SkillCategory }>(
  skills: T[],
): Partial<Record<SkillCategory, T[]>> {
  return SKILL_CATEGORY_ORDER.reduce(
    (groups, category) => {
      const items = skills.filter((skill) => skill.category === category);
      if (items.length > 0) groups[category] = items;
      return groups;
    },
    {} as Partial<Record<SkillCategory, T[]>>,
  );
}

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
  { category: "backend", pattern: /^(node js|node\.js|express|fastify|java|python|flask)$/i },
  { category: "database", pattern: /^(postgresql|postgres|mysql|mongodb|prisma|supabase|redis|sqlite)$/i },
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
