import { getWeeklyPicks, getProjectBySlug } from '@/lib/data';
import { getCurrentYear } from '@/lib/utils';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import WeeklyPicksDirectory, { type WeeklyPickItem } from '@/components/weekly/WeeklyPicksDirectory';

export async function generateMetadata() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const month = months[now.getMonth()];
  const year = getCurrentYear();

  return {
    title: `GitHub Weekly Picks — Top Open Source Projects ${month} ${year}`,
    description: 'Our curated selection of the best GitHub projects this week, with editor notes and use cases.',
    alternates: {
      canonical: `${SITE_URL}/weekly`,
    },
    openGraph: {
      title: `GitHub Weekly Picks ${month} ${year} | ${SITE_NAME}`,
      description: 'Our curated selection of the best GitHub projects this week, with editor notes and use cases.',
      url: `${SITE_URL}/weekly`,
      type: 'website',
    },
  };
}

export default async function WeeklyPage() {
  const weeklyData = getWeeklyPicks();

  const currentPicks = weeklyData.picks.map((pick) => ({ ...pick, week: weeklyData.current_week }));
  const archivedPicks = weeklyData.archive.flatMap((archive) =>
    archive.picks.map((pick) => ({ ...pick, week: archive.week }))
  );
  const picks = [...currentPicks, ...archivedPicks]
    .map((pick) => {
      const project = getProjectBySlug(pick.project_id);
      if (!project) return null;

      return {
        week: pick.week,
        rank: pick.rank,
        week_note: pick.week_note,
        project: {
          name: project.name,
          slug: project.slug,
          stars: project.stars,
          language: project.language,
          category: project.category,
          difficulty: project.difficulty,
          tags: project.tags,
          one_liner: project.one_liner,
        },
      };
    })
    .filter((pick): pick is WeeklyPickItem => pick !== null);

  return (
    <WeeklyPicksDirectory currentWeek={weeklyData.current_week} picks={picks} />
  );
}
