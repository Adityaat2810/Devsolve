import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-6">
        {/* Text Content */}
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Start your coding journey today
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Learn to code from scratch with practice-oriented courses designed by experts.
          </p>
        </div>

        {/* Image */}
        <div className="w-full max-w-md mx-auto">
          <Image
            src="/coding_boy.svg" // Place your SVG image here in public folder
            alt="Coding Illustration"
            width={500}
            height={500}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
