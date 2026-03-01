import { Metadata } from "next";
import { getBlogPosts } from "@/lib/clickup";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section-wrapper";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Workitu Tech",
  description: "AI automation insights, case studies, and technical guides from Workitu Tech.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Section id="blog">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Blog</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              AI automation insights and technical guides
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="mt-14 text-center text-muted-foreground">
              <p>Posts coming soon. Check back later.</p>
            </div>
          ) : (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full transition-colors hover:border-primary/50">
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                      {post.publishDate && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(Number(post.publishDate)).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
}
