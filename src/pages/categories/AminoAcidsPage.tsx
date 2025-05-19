
import CategoryPage from '../CategoryPage';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AminoAcidsPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If accessed directly, ensure the category parameter is set
    if (!params.category) {
      navigate('/category/amino-acids', { replace: true });
    }
  }, [params, navigate]);
  
  return <CategoryPage />;
};

export default AminoAcidsPage;
