import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/layout/section-wrapper";
import { projects as staticProjects } from "@/lib/portfolio-data";
import { getPortfolioItems, type PortfolioItem } from "@/lib/clickup";

const statusColor = {
  live: "bg-green-500/10 text-green-500 border-green-500/20",
  built: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  planned: "bg-gray-500/10 text-gray-500 border-gray-500/20",
} as const;

const statusLabel = {
  live: "Live",
  built: "Built",
  "in-progress": "In Progress",
  planned: "Planned",
} as const;

export async function Portfolio() {
  // Try ClickUp first, fall back to static data
  let items: Array<{
    title: string;
    description: string;
    tags: string[];
    status: keyof typeof statusColor;
    url?: string;
  }> = [];

  try {
    const clickupItems = await getPortfolioItems();
    if (clickupItems.length > 0) {
      items = clickupItems.map((item: PortfolioItem) => ({
        title: item.title,
        description: item.description,
        tags: item.tags,
        status: item.status,
        url: item.url,
      }));
    }
  } catch {
    // ClickUp unavailable, use static
  }

  if (items.length === 0) {
    items = staticProjects;
  }

  return (
    <Section id="portfolio">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          What We Build
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Real projects, real automation. Here&apos;s what we&apos;ve been
          working on.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project) => (
          <Card key={project.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    statusColor[project.status] || statusColor["planned"]
                  }
                >
                  {statusLabel[project.status] || project.status}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
