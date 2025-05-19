
import CategoryPage from '../CategoryPage';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProteinPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If accessed directly, ensure the category parameter is set
    if (!params.category) {
      navigate('/category/protein', { replace: true });
    }
  }, [params, navigate]);
  
  return <CategoryPage />;
};

export default ProteinPage;
