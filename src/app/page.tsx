import Link from 'next/link';
import { BlurImage } from '~/components/image';
import { PostListItem } from '~/components/post-list-item';
import { SiteHeader } from '~/components/site-header';
import { getAllPosts } from '~/lib/posts';
import { work } from '~/lib/site';

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
      <SiteHeader className="reveal" />

      <section className="reveal reveal-delay-1 mt-16 grid gap-8 sm:mt-20 sm:grid-cols-[5rem_1fr] sm:gap-10">
        <BlurImage
          src="/images/me.jpg"
          alt="Portrait of John Eatmon"
          width={80}
          height={80}
          preload
          className="size-16 rounded-full sm:size-20"
        />
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-[color-mix(in_oklab,var(--foreground)_78%,transparent)]">
          <p>Software engineer in Seattle and synthesizer enthusiast.</p>
          <p>
            I build software at ClearHealth Strategies. Before that I spent over 7 years at an
            Orlando IT firm{' '}
            <a
              href="https://read.cv/johneatmon/npsVXnwnPLc03Cfs6863"
              className="underline text-(--foreground) transition-opacity duration-200 hover:opacity-70"
              target="_blank"
              rel="noopener noreferrer"
            >
              doing front-end development, design, technical writing, support, sales, and marketing
            </a>
            .
          </p>
          <p>
            After hours:{' '}
            <a
              href="https://duskworks.dev"
              target="_blank"
              rel="noopener"
              className="underline text-(--foreground) transition-opacity duration-200 hover:opacity-70"
            >
              duskworks.dev
            </a>
            ,{' '}
            <a
              href="https://www.wta.org/@@backpacks/scrnm-jmaeat"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-(--foreground) transition-opacity duration-200 hover:opacity-70"
            >
              hiking
            </a>
            , and{' '}
            <a
              href="/music"
              className="underline text-(--foreground) transition-opacity duration-200 hover:opacity-70"
            >
              making music
            </a>
            .
          </p>
        </div>
      </section>

      <section className="reveal reveal-delay-2 mt-20">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-[11px] tracking-widest text-(--muted) uppercase">Work</h2>
          <a
            href="/cv"
            className="link-fade text-[11px] tracking-[0.08em] text-(--muted) no-underline uppercase hover:text-(--foreground)"
          >
            Full CV →
          </a>
        </div>
        <ul className="flex flex-col">
          {work.map((item) => (
            <li
              key={`${item.company}-${item.position}`}
              className="grid grid-cols-1 items-baseline gap-1 border-b border-(--border) py-4 sm:grid-cols-[1fr_auto] sm:gap-6"
            >
              <p className="tracking-[-0.015em]">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline text-(--foreground) transition-opacity duration-200 hover:opacity-70"
                >
                  {item.position}
                </a>
                <span className="text-(--muted)"> · {item.company}</span>
              </p>
              <p className="text-sm tracking-tight text-(--muted) tabular-nums">
                {item.start}&ndash;{item.end ?? 'Present'}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="reveal reveal-delay-3 mt-20">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-[11px] tracking-widest text-(--muted) uppercase">Writing</h2>
          <Link
            href="/blog"
            className="link-fade text-[11px] tracking-[0.08em] text-(--muted) no-underline uppercase hover:text-(--foreground)"
          >
            All posts →
          </Link>
        </div>
        <div>
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
