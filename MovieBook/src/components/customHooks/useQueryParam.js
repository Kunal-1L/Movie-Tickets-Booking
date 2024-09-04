import { useLocation, useNavigate } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const useUpdateQuery = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const updateQuery = (newParams) => {
        const query = new URLSearchParams(location.search);
        Object.keys(newParams).forEach(key => {
            query.set(key, newParams[key]);
        });
        navigate({ search: query.toString() }, { replace: false });
    };

    return updateQuery;
};

export {useQuery, useUpdateQuery};