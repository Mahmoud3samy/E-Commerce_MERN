import { Box, Typography } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useCart } from '../context/Auth/Cart/CartContext';


const CartPage = () => {
  const { cartItems, totalAmount, updateItemInCart, removeItemInCart } =
    useCart();

  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    updateItemInCart(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItemInCart(productId)
  }

  return (
    <Container fixed sx={{ mt: 2 }}>
      <Typography variant="h4">My Cart</Typography>
      <Box display="flex" flexDirection="column" gap={4}>
        {cartItems.map((item) => (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              border: 1,
              borderColor: '#f2f2f2',
              borderRadius: 5,
              padding: 1,
            }}
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
              <img src={item.image} width={50} />
              <Box>
                <Typography variant="h6">{item.title}</Typography>
                <Typography>
                  {item.quantity} X {item.unitPrice} EGP
                </Typography>
                <Button onClick={() => handleRemoveItem(item.productId)}>Remove Item</Button>
              </Box>
            </Box>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button onClick={() => handleQuantity(item.productId, item.quantity -1)}> -</Button>
              <Button onClick={() => handleQuantity(item.productId, item.quantity + 1)}> + </Button>
            </ButtonGroup>
          </Box>
        ))}
        <Box>
          <Typography variant="h4">
            TotalAmount: {totalAmount.toFixed(2)} EGP{' '}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CartPage;
