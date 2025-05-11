
interface UGCItem {
  id: string;
  image: string;
  username: string;
  caption: string;
}

interface UGCStripProps {
  items: UGCItem[];
}

const UGCStrip = ({ items }: UGCStripProps) => {
  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">#ChargedUpCrew</h2>
        <p className="text-gray-600">See how our community is crushing their fitness goals</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden">
            <img 
              src={item.image} 
              alt={`Post by ${item.username}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-white text-center p-4">
                <p className="font-medium">@{item.username}</p>
                <p className="text-sm line-clamp-3 mt-2">{item.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UGCStrip;
