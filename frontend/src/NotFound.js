import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';

const NotFound = () => {
    return (
        <div className="not-found">
            <ErrorIcon sx={{ color: '#0066be' }} fontSize="large" />
            <h2>Error 404 : Page not found</h2>
            <Button
                href="/"
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Back to the home page
            </Button>
        </div>
    );
}
 
export default NotFound;