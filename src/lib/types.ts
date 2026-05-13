export interface Project {
  id: string;
  name: string;
  slug: string;
  github_url: string;
  website_url?: string;
  docs_url?: string;
  install_url?: string;
  deploy_url?: string;
  stars: number;
  language: string;
  license: string;
  category: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
  target_audience: string[];
  one_liner: string;
  highlights: string[];
  use_cases: UseCase[];
  editors_note: string;
  featured?: boolean;
  weekly_pick?: boolean;
  week?: string;
  category_rank?: number;
  added_date: string;
  related_projects: string[];
  affiliate_opportunity?: string | null;
  cross_links?: CrossLink[];
}

export interface SearchProject {
  id?: string;
  name: string;
  slug: string;
  stars: number;
  category: string;
  tags: string[];
  one_liner: string;
  difficulty?: 1 | 2 | 3;
  target_audience?: string[];
  language?: string;
  license?: string;
  added_date?: string;
  featured?: boolean;
  weekly_pick?: boolean;
}

export interface UseCase {
  scenario: string;
  description: string;
}

export interface CrossLink {
  label: string;
  url: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  seo_title?: string;
  project_count: number;
}

export interface WeeklyPick {
  project_id: string;
  rank: number;
  week_note: string;
}

export interface WeeklyPicksData {
  current_week: string;
  picks: WeeklyPick[];
  archive: {
    week: string;
    picks: WeeklyPick[];
  }[];
}

export interface Comparison {
  id: string;
  project_a: string;
  project_b: string;
  seo_title: string;
  seo_description: string;
  comparison_table: {
    stars_a: number;
    stars_b: number;
    language_a: string;
    language_b: string;
    license_a: string;
    license_b: string;
    difficulty_a: 1 | 2 | 3;
    difficulty_b: 1 | 2 | 3;
    best_for_a: string;
    best_for_b: string;
  };
  verdict: string;
  related_comparisons: string[];
}

export interface UseCasePage {
  id: string;
  slug: string;
  title: string;
  description: string;
  recommended_projects: string[];
  editor_note: string;
  related_scenes: string[];
  seo_title: string;
  seo_description: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  estimated_read: string;
  seo_title: string;
  seo_description: string;
  related_projects: string[];
  related_guides: string[];
}
