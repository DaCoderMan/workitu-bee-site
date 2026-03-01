import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/layout/section-wrapper";
import { projects } from "@/lib/portfolio-data";

const statusColor = {
  live: "bg-green-500/10 text-green-500 border-green-500/20",
  built: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "in-progress": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
} as const;

const statusLabel = {
  live: "Live",
  built: "Built",
  "in-progress": "In Progress",
} as const;

export function Portfolio() {
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
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge
                  variant="outline"
                  className={statusColor[project.status]}
                >
                  {statusLabel[project.status]}
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
