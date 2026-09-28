import MasonryGridGallery from "../components/MasonryGridGallery";

export default function Home() {

  return (
    <div className="p-6">
      <MasonryGridGallery />
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {products.map((p) => (
          <EcommerceCard
            key={p._id}
            name={p.name}
            price={p.price}
            image={p.image}
            description={p.desc}
          />
        ))}
      </div> */}
    </div>
  );
}
