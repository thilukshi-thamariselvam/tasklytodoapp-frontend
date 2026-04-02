import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommandPalette from '../components/CommandPalette/CommandPalette';

const SearchPage = () => {
    const navigate = useNavigate();

    return (
        <CommandPalette 
            isOpen={true} 
            onClose={() => navigate(-1)} 
        />
    );
};

export default SearchPage;