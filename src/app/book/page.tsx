import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section-wrapper";
import { Calendar, Clock, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Book a Call | Workitu Tech",
  description:
    "Schedule a free 30-minute discovery call to discuss your automation needs.",
};

export default function BookPage() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Section id="book">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Book a Discovery Call
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Free 30-minute call to discuss your automation needs
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                <Clock className="h-8 w-8 text-primary" />
                <p className="font-medium">30 Minutes</p>
                <p className="text-sm text-muted-foreground">
                  Quick, focused conversation about your workflow
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                <Video className="h-8 w-8 text-primary" />
                <p className="font-medium">Google Meet</p>
                <p className="text-sm text-muted-foreground">
                  Video call with screen sharing
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
                <Calendar className="h-8 w-8 text-primary" />
                <p className="font-medium">Your Timezone</p>
                <p className="text-sm text-muted-foreground">
                  Pick a time that works for you
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            {bookingUrl ? (
              <div className="overflow-hidden rounded-lg border">
                <iframe
                  src={bookingUrl}
                  className="h-[600px] w-full"
                  title="Book a call"
                />
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">
                    Booking calendar coming soon
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    In the meantime, reach out via the{" "}
                    <a href="/#contact" className="text-primary underline">
                      contact form
                    </a>{" "}
                    and we&apos;ll schedule a call.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
