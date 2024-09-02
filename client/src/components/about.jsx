import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-96">
        <img
          src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
          alt="Delicious dishes"
          className="w-full h-full object-cover"
        />
        <div className="backdrop-blur-lg absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Hamro Recipe</h1>
            <p className="text-xl text-white">Bringing the flavors of Nepal to your kitchen</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 backdrop-blur-3xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Column */}
            <div className="md:w-1/2 text-white">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="mb-6">
                Hamro Recipe is dedicated to preserving and sharing the rich culinary heritage of Nepal. Our mission is to make authentic Nepali recipes accessible to food enthusiasts around the world, promoting cultural exchange through the universal language of food.
              </p>
              <p className="mb-6">
                We believe that every dish tells a story, and through our carefully curated collection of recipes, we aim to bring the warmth, flavors, and traditions of Nepali kitchens to homes across the globe.
              </p>
              <p className="mb-6">
                Whether youre a seasoned chef or a curious beginner, Hamro Recipe provides step-by-step guides, video tutorials, and a supportive community to help you master the art of Nepali cooking.
              </p>
              <Button className="text-white font-bold py-3 px-6 rounded-full">
                Join Our Community <Mail className="ml-2" />
              </Button>
            </div>
            {/* Right Column */}
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                  alt="Nepali dish 1"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <img
                  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                  alt="Nepali dish 2"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <img
                  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                  alt="Cooking process"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <img
                  src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
                  alt="Community event"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
