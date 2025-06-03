import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/Products";
import { BASE_URL } from "../constants/baseUrl";
import { Box } from "@mui/material";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product`);
        const data = await response.json();
        setProducts(data);
      } catch {
        setError(true);
      }
    };

    fetchData();
  }, []);

  if(error) {
    return <Box>Something want wrong, place try again!</Box>
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item md={4}>
            <ProductCard {...p}/>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;