"use client";

import { useEffect, useState } from "react";
import { FolderOpen, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BeeChat } from "@/components/dashboard/bee-chat";

type Project = {
  id: string;
  name: string;
  status: string;
  statusColor: string;
  created: string;
  dueDate?: string;
  description: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <p className="mt-1 text-muted-foreground">
          Track the status of your active automation projects
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium">No active projects</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your projects will appear here once you start working with us.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: project.statusColor,
                      color: project.statusColor,
                    }}
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Created:{" "}
                  {new Date(Number(project.created)).toLocaleDateString()}
                  {project.dueDate && (
                    <>
                      {" "}
                      | Due:{" "}
                      {new Date(Number(project.dueDate)).toLocaleDateString()}
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chat with Bee */}
      <div id="chat">
        <BeeChat />
      </div>
    </div>
  );
}
