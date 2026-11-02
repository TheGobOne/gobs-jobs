import overrides from '../data/tools.json';

const USER = 'TheGobOne';

export interface Tool {
  name: string;
  title: string;
  description: string;
  github: string;
  live?: string;
}

function normalizeUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

export async function getTools(): Promise<Tool[]> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const repos: any[] = await res.json();
  const o = overrides as Record<string, any>;

  return repos
    .filter((r) => (!r.fork || o[r.name]?.include) && !r.archived && !r.private && !o[r.name]?.hidden)
    .map((r) => {
      const ov = o[r.name] ?? {};
      const github = r.html_url as string;
      const live = normalizeUrl(ov.live ?? r.homepage);
      return {
        name: r.name,
        title: ov.title ?? r.name,
        description: ov.description ?? r.description ?? '',
        github,
        live: live && live !== github ? live : undefined,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}
