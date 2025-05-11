
import { Link } from 'react-router-dom';

type CategoryLink = {
  name: string;
  image: string;
  link: string;
};

interface QuickCategoryLinksProps {
  categories: CategoryLink[];
}

const QuickCategoryLinks = ({ categories }: QuickCategoryLinksProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link 
          key={category.name} 
          to={category.link}
          className="group relative overflow-hidden rounded-lg shadow-md aspect-square"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${category.image})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <span className="text-white font-oswald text-xl tracking-wide group-hover:text-primary transition-colors duration-300">
              {category.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickCategoryLinks;
