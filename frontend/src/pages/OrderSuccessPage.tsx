import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { Button, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';


const OrderSuccessPage = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  }
  return (
    <Container
      fixed
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        gap: 1,
      }}
    >
      <CheckCircleOutline sx={{ color: "green", fontSize: "80" }}>
        <Typography variant="h4"> Thanks for you order.</Typography>
        <Typography>
          We started processing it, and we will get to you soon
        </Typography>
        <Button variant="contained" onClick={handleHome}>Go to Home</Button>
      </CheckCircleOutline>
    </Container>
  );
};

export default OrderSuccessPage;
