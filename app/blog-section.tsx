import Link from 'next/link';
import { allBlogs } from '~/.contentlayer/generated';
import BlogPost from '~/components/blog-post';
import Section from '~/components/section';

const BlogSection = async ({ count = -1 }: { count?: number }) => {
	return (
		<Section title='Writing'>
			<ul role='list' className='flex flex-col gap-4'>
				{allBlogs
					.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
					.slice(0, count)
					.map((post) => (
						<li key={post.slug}>
							<BlogPost {...post} />
						</li>
					))}
				<li className='font-sans'>
					Read more{' '}
					<Link href='/blog' className='text-gray-950 dark:text-gray-50'>
						blog posts
					</Link>
				</li>
			</ul>
		</Section>
	);
};
export default BlogSection;
