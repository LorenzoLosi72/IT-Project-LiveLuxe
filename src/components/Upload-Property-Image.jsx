import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function UploadPropertyImages({ propertyID }) {
    const [images, setImages] = useState([]);
    const [descriptions, setDescriptions] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleDescriptionChange = (index, description) => {
        setDescriptions((prev) => ({ ...prev, [index]: description }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append('images', image);
            formData.append(`descriptions[${index}]`, descriptions[index] || '');
        });
        formData.append('propertyID', propertyID);

        try {
            const response = await axios.post('http://localhost:3001/api/upload-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccess(true);
                setError('');
            }
        } catch (err) {
            console.error('Error uploading images:', err);
            setError('Failed to upload images. Please try again.');
            setSuccess(false);
        }
    };

    return (
        <Container>
            <h1 className="text-center mb-4">Upload Property Images</h1>
            {success && <p className="text-success">Images uploaded successfully!</p>}
            {error && <p className="text-danger">{error}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formImages" className="mb-3">
                    <Form.Label>Upload Images</Form.Label>
                    <Form.Control type="file" multiple onChange={handleImageChange} required />
                </Form.Group>
                {images.map((image, index) => (
                    <Form.Group key={index} controlId={`description-${index}`} className="mb-3">
                        <Form.Label>Description for Image {index + 1}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter description"
                            value={descriptions[index] || ''}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        />
                    </Form.Group>
                ))}
                <Button variant="primary" type="submit" className="w-100">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default UploadPropertyImages;
