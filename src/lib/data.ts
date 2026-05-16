import fs from 'fs';
import path from 'path';
import type { Project, Category, WeeklyPicksData } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const contents = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(contents);
}

export function getProjects(): Project[] {
  const data = readJSON<{ projects: Project[] }>('projects.json');
  return data.projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getProjectsByCategory(categorySlug: string): Project[] {
  return getProjects().filter((p) => p.category === categorySlug);
}

export function getLatestProjects(limit: number = 6): Project[] {
  return [...getProjects()]
    .sort((a, b) => new Date(b.added_date).getTime() - new Date(a.added_date).getTime())
    .slice(0, limit);
}

export function getFeaturedProjects(limit: number = 3): Project[] {
  return getProjects().filter((p) => p.featured).slice(0, limit);
}

export function getWeeklyPickProjects(): Project[] {
  return getProjects().filter((p) => p.weekly_pick);
}

export function getCategories(): Category[] {
  const data = readJSON<{ categories: Category[] }>('categories.json');
  const projects = getProjects();
  const counts = projects.reduce<Record<string, number>>((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {});

  return data.categories.map((category) => ({
    ...category,
    project_count: counts[category.slug] || 0,
  }));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getWeeklyPicks(): WeeklyPicksData {
  return readJSON<WeeklyPicksData>('weekly-picks.json');
}
