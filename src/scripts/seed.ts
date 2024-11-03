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
      title: 'Unlocking the Power of JavaScript: A Guide for Beginners',
      body: 'JavaScript is more than just a programming language; it’s the core of modern web development. In this article, we explore essential concepts, from variables to functions, to help you kickstart your coding journey.',
      author: 'John Doe',
      date: '2023-05-12',
      tags: ['JavaScript', 'Web Development', 'Programming Basics']
    },
    {
      title: 'Understanding Asynchronous Programming in Node.js',
      body: 'Handling asynchronous tasks efficiently is critical for building high-performance applications in Node.js. Learn how to use callbacks, promises, and async/await to manage asynchronous code and improve your app’s responsiveness.',
      author: 'Jane Smith',
      date: '2023-06-20',
      tags: ['Node.js', 'Asynchronous Programming', 'Backend Development']
    },
    {
      title: '10 Tips to Improve Your Coding Productivity',
      body: 'Boosting productivity as a developer involves more than just writing code. From organizing your workspace to leveraging code automation tools, here are ten tips to help you code more efficiently.',
      author: 'Emily Chen',
      date: '2023-07-15',
      tags: ['Productivity', 'Developer Tools', 'Coding Tips']
    },
    {
      title: 'Building RESTful APIs with Express',
      body: 'Creating RESTful APIs with Express allows for seamless communication between your application and client-side. This guide covers the essentials of setting up routes, handling requests, and sending responses in an Express application.',
      author: 'Michael Brown',
      date: '2023-08-03',
      tags: ['Express', 'API Development', 'Backend']
    },
    {
      title: 'The Future of Web Development: Trends to Watch in 2024',
      body: 'As technology evolves, so does web development. In this article, we look at the latest trends shaping the future, from AI integration to WebAssembly and more, helping you stay ahead in the digital landscape.',
      author: 'Sophia Lee',
      date: '2023-10-05',
      tags: ['Web Development', 'Future Trends', 'Technology']
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
