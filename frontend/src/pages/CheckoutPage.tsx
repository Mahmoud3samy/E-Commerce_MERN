import { Box, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useCart } from '../context/Auth/Cart/CartContext';
import { useRef } from 'react';
import { BASE_URL } from '../constants/baseUrl';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth/AuthContext';

const CheckoutPage = () => {
  const { cartItems, totalAmount } = useCart();
  const { token } = useAuth();

  const addressRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleConfirmOrder = async () => {
    const address = addressRef.current?.value;

    if (!address) return;

    const response = await fetch(`${BASE_URL}/user/cart/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authhorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address,
      }),
    });

    if (!response.ok) return;

    navigate('/order-success');
  };

  return (
    <Container
      fixed
      sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Checkout</Typography>
      </Box>
      <TextField
        inputRef={addressRef}
        label="Delivery Address"
        name="address"
        fullWidth
      />
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{
          border: 1,
          borderColor: '#f2f2f2',
          borderRadius: 5,
          padding: 1,
        }}
      >
        {cartItems.map((item) => (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{
              border: 1,
              borderColor: '#f2f2f2',
              borderRadius: 5,
              padding: 1,
            }}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={1}
              width="100%"
            >
              <img src={item.image} width={50} />
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Typography variant="h6">{item.title}</Typography>
                <Typography>
                  {item.quantity} X {item.unitPrice} EGP
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <Box>
          <Typography variant="body2" sx={{ textAline: 'right' }}>
            TotalAmount: {totalAmount.toFixed(2)} EGP
          </Typography>
        </Box>
      </Box>
      <Button variant="contained" fullWidth onClick={handleConfirmOrder}>
        Pay Now
      </Button>
    </Container>
  );
};

export default CheckoutPage;
