import { User } from '../entity/User';
import { Blog } from '../entity/Blog';
import { AppDataSource } from '../data-source';

const seed = async () => {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const blogRepository = AppDataSource.getRepository(Blog);

  // Find or create the user
  let admin = await userRepository.findOne({ where: { email: 'admin@blog.com' } });

  if (!admin) {
    admin = new User();
    admin.email = 'admin@blog.com';
    admin.password = 'Admin@123';
    admin.firstName = 'First';
    admin.lastName = 'User';
    admin.avatar = 'https://i.pravatar.cc/300';

    admin = await userRepository.save(admin);
    console.log('New user created:', admin);
  } else {
    console.log('User already exists');
  }

  // Create blog entries for the user
  const blogs = [
    {
      title: 'First Blog Post',
      body: 'This is the body of the first blog post.',
    },
    {
      title: 'Second Blog Post',
      body: 'This is the body of the second blog post.',
    },
    {
      title: 'Another Blog Post',
      body: 'This is the body of another blog post.',
    },
  ];

  for (const blogData of blogs) {
    let blog = await blogRepository.findOne({ where: { title: blogData.title, user: { id: admin.id } } });

    // Create the blog if it doesn't already exist
    if (!blog) {
      blog = new Blog();
      blog.title = blogData.title;
      blog.body = blogData.body;
      blog.image = `https://dummyimage.com/600x400/000/fff.png&text=${encodeURIComponent(blog.title)}`;
      blog.user = admin;

      await blogRepository.save(blog);
      console.log(`Blog "${blog.title}" created with slug "${blog.slug}"`);
    } else {
      console.log(`Blog "${blog.title}" already exists for user ${admin.email}`);
    }
  }

  await AppDataSource.destroy();
  console.log('Seeding completed successfully.');
};

seed().catch((error) => console.error('Error during seeding:', error));
