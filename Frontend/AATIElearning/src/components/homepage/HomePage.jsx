import { Link } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Layout from "../HeaderFooter/Header";


const HomePage = () => {
  const courses = [
    { id: 1, title: 'Hair Dressing & Beauty', description: 'Certificate in either Beuty or Hair Dressing.', image: '/images/course1.jpg' },
    { id: 2, title: 'Fashio & Design', description: 'Clothing Design and Branding', image: '/images/course2.jpg' },
    { id: 3, title: '   IT, Media and Art', description: 'Web Design and Dev,Acting and content Dev.', image: '/images/course3.jpg' },
  ];

  const books = [
    { id: 1, title: 'Beautiful Health Hair', author: 'Kamillah Lee', image: '/images/book1.jpg' },
    { id: 2, title: 'The new Black Vanguard', author: 'John Thompson', image: '/images/book2.jpg' },
    { id: 3, title: 'You Don’t Know JS', author: 'James Breea', image: '/images/book3.jpg' },
  ];

  return (
    <div className="bg-white-50 text-gray-800 min-h-screen flex flex-col">
      {/* Header */}
      <Layout>
        {/* Hero Section with Slider and Centered Text */}
        <section className="mb-12 relative">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={4000}
            className="h-full"
          >

            <div className="relative h-screen">
              <img src="/images/hero1.jpg" alt="Slide 1" className="object-cover h-full w-full" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to LearnZone</h1>
                <p className="text-lg mb-4">Empowering your future through knowledge</p>
                <Link
                  to="/courses"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Browse Courses
                </Link>
              </div>
            </div>

            <div className="relative h-screen">
              <img src="/images/hero2.jpg" alt="Slide 2" className="object-cover h-full w-full" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Popular Courses</h1>
                <p className="text-lg mb-4">Join thousands of learners mastering new skills</p>
                <Link
                  to="/courses"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Explore Now
                </Link>
              </div>
            </div>

            <div className="relative h-screen">
              <img src="/images/hero3.jpg" alt="Slide 3" className="object-cover h-full w-full" />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Access eBooks & Materials</h1>
                <p className="text-lg mb-4">Find curated resources to help you succeed</p>
                <Link
                  to="/books"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Visit Book Portal
                </Link>
              </div>
            </div>
          </Carousel>
        </section>


        <section className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">🔥 Popular Courses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <img src={course.image} alt={course.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Books */}
        <section className="bg-blue-50 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-700">📚 Featured Books</h2>
              <Link to="/books" className="text-blue-600 hover:underline text-sm">Visit Books Portal →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {books.map(book => (
                <div key={book.id} className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition">
                  <img src={book.image} alt={book.title} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="text-gray-500">by {book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
};

export default HomePage;