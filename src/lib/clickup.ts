const CLICKUP_API = "https://api.clickup.com/api/v2";

function getToken() {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) throw new Error("CLICKUP_API_TOKEN not set");
  return token;
}

async function clickupFetch(path: string) {
  const res = await fetch(`${CLICKUP_API}${path}`, {
    headers: { Authorization: getToken() },
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });
  if (!res.ok) {
    throw new Error(`ClickUp API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Portfolio items from ClickUp list
export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "live" | "built" | "in-progress" | "planned";
  url?: string;
  github?: string;
};

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const listId = process.env.CLICKUP_PORTFOLIO_LIST_ID;
  if (!listId) return [];

  try {
    const data = await clickupFetch(
      `/list/${listId}/task?statuses[]=live&statuses[]=built&statuses[]=in progress&statuses[]=planned&subtasks=false`
    );

    return (data.tasks || []).map((task: Record<string, unknown>) => {
      const customFields = (task.custom_fields || []) as Array<{
        name: string;
        value?: string;
      }>;
      const urlField = customFields.find(
        (f) => f.name?.toLowerCase() === "live url"
      );
      const githubField = customFields.find(
        (f) => f.name?.toLowerCase() === "github url"
      );
      const status = task.status as { status: string } | undefined;
      const statusName = status?.status?.toLowerCase() || "planned";

      const tags = ((task.tags || []) as Array<{ name: string }>).map(
        (t) => t.name
      );

      return {
        id: task.id as string,
        title: task.name as string,
        description: ((task.description as string) || "").slice(0, 200),
        tags,
        status: statusName.replace(" ", "-") as PortfolioItem["status"],
        url: urlField?.value || undefined,
        github: githubField?.value || undefined,
      };
    });
  } catch (e) {
    console.error("Failed to fetch portfolio from ClickUp:", e);
    return [];
  }
}

// Blog posts from ClickUp list
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  publishDate: string;
  status: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const listId = process.env.CLICKUP_BLOG_LIST_ID;
  if (!listId) return [];

  try {
    const data = await clickupFetch(
      `/list/${listId}/task?statuses[]=published&subtasks=false&order_by=due_date&reverse=true`
    );

    return (data.tasks || []).map((task: Record<string, unknown>) => {
      const customFields = (task.custom_fields || []) as Array<{
        name: string;
        value?: string;
      }>;
      const slugField = customFields.find(
        (f) => f.name?.toLowerCase() === "slug"
      );

      const tags = ((task.tags || []) as Array<{ name: string }>).map(
        (t) => t.name
      );

      const title = task.name as string;
      const slug =
        slugField?.value ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const description = (task.description as string) || "";

      return {
        id: task.id as string,
        title,
        slug,
        content: description,
        excerpt: description.slice(0, 160).replace(/\n/g, " ") + "...",
        tags,
        publishDate: (task.due_date as string) || (task.date_created as string),
        status: (task.status as { status: string })?.status || "published",
      };
    });
  } catch (e) {
    console.error("Failed to fetch blog posts from ClickUp:", e);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
