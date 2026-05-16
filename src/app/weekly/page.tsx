import { getWeeklyPicks, getProjectBySlug } from '@/lib/data';
import { getCurrentYear } from '@/lib/utils';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import WeeklyPicksDirectory, { type WeeklyPickItem } from '@/components/weekly/WeeklyPicksDirectory';

export async function generateMetadata() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const now = new Date();
  const month = months[now.getMonth()];
  const year = getCurrentYear();
  const weeklyData = getWeeklyPicks();
  const description = `Browse ${weeklyData.picks.length} curated GitHub weekly picks for ${weeklyData.current_week}, with editor notes, use cases, difficulty ratings, and open source project links.`;

  return {
    title: `GitHub Weekly Picks — Top Open Source Projects ${month} ${year}`,
    description,
    alternates: {
      canonical: `${SITE_URL}/weekly`,
    },
    openGraph: {
      title: `GitHub Weekly Picks ${month} ${year} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/weekly`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `GitHub Weekly Picks ${month} ${year} | ${SITE_NAME}`,
      description,
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
  const currentPickItems = picks
    .filter((pick) => pick.week === weeklyData.current_week)
    .sort((a, b) => a.rank - b.rank);
  const weeklyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `GitHub Weekly Picks ${weeklyData.current_week}`,
    description: `Curated open source project recommendations for ${weeklyData.current_week}.`,
    url: `${SITE_URL}/weekly`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: currentPickItems.map((pick) => ({
        '@type': 'ListItem',
        position: pick.rank,
        name: pick.project.name,
        description: pick.week_note,
        url: `${SITE_URL}/project/${pick.project.slug}`,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(weeklyJsonLd) }} />
      <WeeklyPicksDirectory currentWeek={weeklyData.current_week} picks={picks} />
    </>
  );
}
