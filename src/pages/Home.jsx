import { useEffect } from "react";
import { useDispatch } from "react-redux";
import MasonryGridGallery from "../components/MasonryGridGallery";

export default function Home() {
  const dispatch = useDispatch();
  // const { products } = useSelector((state) => state.products);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/api/products");
  //       const data = await response.json();
  //       dispatch(setProducts(data));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchProducts();
  // }, [dispatch]);

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
